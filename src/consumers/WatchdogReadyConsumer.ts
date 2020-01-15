import { Watchdog, UnitInterface, WatchItem } from '@intent/watchdog';

import { TreeNode } from '../kernel/ast';

import { CoreEvent, AbstractConsumer, ConsumerStat, ReadyEvent, CoreEventBus } from '../kernel/event';
import { DependencyNode, Identifiable, DependencyManager } from '../kernel/dependencies';
import { UpdateEvent } from './flow-events';

interface RetainedWatch<N extends TreeNode, T extends Identifiable<N>> {
  node: DependencyNode<N, T>,
  watches: WatchItem<UnitInterface>[],
}

export enum WatchdogStatType {
  WATCH,
  UNWATCH,
}

export class WatchdogStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
  public constructor(public readonly watch: WatchdogStatType, public readonly node: DependencyNode<N, T>) {
    super();
  }
}

export class WatchdogReadyConsumer<U extends UnitInterface, N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<ReadyEvent, any> {
  private static WATCHDOG_EVENTS = ['change', 'unlink', 'add'];

  private readonly watchdog: Watchdog<U>;
  private readonly tree: DependencyManager<N, T>;
  private watched: RetainedWatch<N, T>[] = [];

  public constructor(bus: CoreEventBus, watchdog: Watchdog<U>, tree: DependencyManager<N, T>) {
    super(bus);
    this.watchdog = watchdog;
    this.tree = tree;
    this.tree.onretain((node: DependencyNode<N, T>) => {
      this.watch(node);
    });
    this.tree.onrelease((node: DependencyNode<N, T>) => {
      this.unwatch(node);
    })
  }

  public supports(event: CoreEvent<any>): boolean {
    return this.watchdog && (event.type === ReadyEvent.type());
  }

  public process(event: ReadyEvent) {
    this.watchdog.start();

    this.stat(event, {
      type: 'log',
      message: {
        log: 'Watching for changes...',
      },
    });

    return event;
  }

  private watching(node: DependencyNode<N, T>): RetainedWatch<N, T>|undefined {
    return this.watched.find((v) => v.node === node);
  }

  private watch(node: DependencyNode<N, T>) {
    if (this.watching(node)) {
      return;
    }

    const watches = this.watchdog
      .watchAll(node.identifier, WatchdogReadyConsumer.WATCHDOG_EVENTS)
      .map((watch) => {
        watch.emitter.and(this.event.bind(this));

        return watch;
      })
    ;

    this.watched.push({ node, watches });
    this.watchdog.start(watches);

    this.stat(null, new WatchdogStat(WatchdogStatType.WATCH, node));
  }

  private unwatch(node: DependencyNode<N, T>) {
    const retainedWatch = this.watching(node);

    if (!retainedWatch) {
      return;
    }

    for (const watch of retainedWatch.watches) {
      watch.detach();
    }

    this.watched = this.watched.filter((w) => w !== retainedWatch);

    this.stat(null, new WatchdogStat(WatchdogStatType.UNWATCH, node));
  }

  protected event(data) {
    for (const { path } of data) {
      this.emit(new UpdateEvent({
        path,
        entry: '%W', // todo: entry forwarding
      }));
    }
  }
}
