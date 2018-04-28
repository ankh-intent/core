
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { UpdateEvent } from '../events/UpdateEvent';
import { ReadyEvent } from '../events/ReadyEvent';
import { CoreEventBus } from '../CoreEventBus';
import { Watchdog } from '../../../intent-watchdog/core/Watchdog';
import { UnitInterface } from '../../../intent-watchdog/core/Unit';
import { WatchItem } from '../../../intent-watchdog/core/WatchItem';
import { DependencyManager } from '../../watchdog/dependencies/DependencyManager';
import { DependencyNode } from '../../watchdog/dependencies/DependencyNode';

interface RetainedWatch {
  node: DependencyNode,
  watches: WatchItem<UnitInterface>[],
}

export class WatchdogReadyConsumer<U extends UnitInterface> extends AbstractConsumer<ReadyEvent, any> {
  private readonly watchdog: Watchdog<U>;
  private readonly tree: DependencyManager;
  private watched: RetainedWatch[] = [];

  public constructor(bus: CoreEventBus, watchdog: Watchdog<U>, tree: DependencyManager) {
    super(bus);
    this.watchdog = watchdog;

    if (this.watchdog) {
      this.tree = tree;
      this.tree.onretain((node: DependencyNode) => {
        this.watch(node);
      });
      this.tree.onrelease((node: DependencyNode) => {
        this.unwatch(node);
      })
    }
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

  private watching(node: DependencyNode): RetainedWatch {
    return this.watched.find((v) => v.node === node);
  }

  private watch(node: DependencyNode) {
    if (this.watching(node)) {
      return;
    }

    let path = node.chip.path;
    let watches = ['change', 'unlink', 'add'].map((event: string) => {
      let watch = this.watchdog
        .watch({
          event: event,
          pattern: path,
        });

      watch.emitter.and(this.event.bind(this));

      return watch;
    });

    this.watched.push({
      node,
      watches,
    });
    this.watchdog.start(watches);

    this.stat(null, {
      type: 'watchdog',
      watch: node.chip.path,
    });
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

    this.stat(null, {
      type: 'watchdog',
      unwatch: node.chip.path,
    });
  }

  protected event(data) {
    for (let { path } of data) {
      this.emit(new UpdateEvent({
        path,
      }));
    }
  }
}
