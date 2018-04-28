import { CoreEvent } from '../../kernel/CoreEvent';
import { AbstractConsumer } from '../../kernel/AbstractConsumer';
import { ConsumerStat } from '../../kernel/ConsumerStat';

import { UpdateEvent } from './UpdateEvent';
import { ReadyEvent } from '../../kernel/events/ReadyEvent';
import { CoreEventBus } from '../../kernel/CoreEventBus';
import { Watchdog } from '../../kernel/watchdog/Watchdog';
import { UnitInterface } from '../../kernel/watchdog/Unit';
import { WatchItem } from '../../kernel/watchdog/WatchItem';
import { DependencyManager } from '../../kernel/watchdog/dependencies/DependencyManager';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';

interface RetainedWatch {
  node: DependencyNode,
  watches: WatchItem<UnitInterface>[],
}

export enum WatchdogStatType {
  WATCH,
  UNWATCH,
}

export class WatchdogStat extends ConsumerStat {
  public constructor(public readonly watch: WatchdogStatType, public readonly node: DependencyNode) {
    super();
  }
}

export class WatchdogReadyConsumer<U extends UnitInterface> extends AbstractConsumer<ReadyEvent, any> {
  private readonly watchdog: Watchdog<U>;
  private readonly tree: DependencyManager;
  private watched: RetainedWatch[] = [];
  private static WATCHDOG_EVENTS = ['change', 'unlink', 'add'];

  public constructor(bus: CoreEventBus, watchdog: Watchdog<U>, tree: DependencyManager) {
    super(bus);
    this.watchdog = watchdog;
    this.tree = tree;
    this.tree.onretain((node: DependencyNode) => {
      this.watch(node);
    });
    this.tree.onrelease((node: DependencyNode) => {
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

  private watching(node: DependencyNode): RetainedWatch|null {
    return this.watched.find((v) => v.node === node);
  }

  private watch(node: DependencyNode) {
    if (this.watching(node)) {
      return;
    }

    let watches = this.watchdog
      .watchAll(node.path, WatchdogReadyConsumer.WATCHDOG_EVENTS)
      .map((watch) => {
        watch.emitter.and(this.event.bind(this));

        return watch;
      })
    ;

    this.watched.push({ node, watches });
    this.watchdog.start(watches);

    this.stat(null, new WatchdogStat(WatchdogStatType.WATCH, node));
  }

  private unwatch(node: DependencyNode) {
    let retainedWatch = this.watching(node);

    if (!retainedWatch) {
      return;
    }

    for (let watch of retainedWatch.watches) {
      watch.detach();
    }

    this.watched = this.watched.filter((w) => w !== retainedWatch);

    this.stat(null, new WatchdogStat(WatchdogStatType.UNWATCH, node));
  }

  protected event(data) {
    for (let { path } of data) {
      this.emit(new UpdateEvent({
        path,
      }));
    }
  }
}
