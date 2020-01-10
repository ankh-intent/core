import { ErrorConsumer } from './consumers/errors/ErrorConsumer';
import { StatConsumer } from './consumers/stat/StatConsumer';
import { UpdateEvent } from './consumers/watching/UpdateEvent';
import { CoreConfig } from './CoreConfig';
import { TreeNode } from './kernel/ast';

import { Identifiable } from './kernel/dependencies/DependencyNode';
import { CoreEvent } from './kernel/event/CoreEvent';

import { CoreEventBus } from './kernel/event/CoreEventBus';

import { EventChainMonitor, EventChainMonitoringData } from './kernel/event/EventChainMonitor';
import { FatalEvent } from './kernel/event/events/FatalEvent';
import { ReadyEvent } from './kernel/event/events/ReadyEvent';
import { StopEvent } from './kernel/event/events/StopEvent';
import { CoreLogger } from './kernel/logging/CoreLogger';
import { RecursiveFinder } from './kernel/source/Finder';
import { PipelineObserverFactory } from './PipelineObserver';
import { Emitter, Logger, UnitMatcher } from './utils';

type CoreEventEmitter<T> = (event: CoreEvent<T>) => any;

export interface ConfigFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: CoreConfig): C;
}

export class Core<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> extends Emitter<CoreEventEmitter<any>> {
  private readonly eventChainMonitor: EventChainMonitor<CoreEvent<any>>;

  public readonly events: CoreEventBus;
  public readonly logger: Logger;

  public constructor() {
    super();
    this.logger = new CoreLogger();
    this.events = new CoreEventBus();
    this.eventChainMonitor = new EventChainMonitor(this.events);
  }

  public bootstrap(config: CoreConfig, configFactory: ConfigFactory<C, N, T>, observerFactory: PipelineObserverFactory<C, N, T>): C {
    const resolved = configFactory(this, config);
    const observer = observerFactory(this, resolved);

    this.events.reset();
    this.events.add(this.eventChainMonitor);

    observer.bootstrap(this, resolved);

    this.events
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
      .add(this.eventChainMonitor)
      .add({
        consume: (event) => {
          this.emit(event);

          if (event instanceof FatalEvent) {
            this.stop();
          }
        }
      })
    ;

    return resolved;
  }

  public start(config: C): this {
    const updates: CoreEvent<any>[] = [];

    for (const [name, entry] of Object.entries(config.entry)) {
      updates.push(
        ...this
          .matched(entry.path, entry.test)
          .map((path) => new UpdateEvent({ path, entry: name }))
      )
    }

    this.eventChainMonitor
      .monitor(updates)
      .once((data: EventChainMonitoringData) => {
        this.events.emit(new ReadyEvent(data))
      })
    ;

    for (const update of updates) {
      this.events.emit(update);
    }

    return this;
  }

  public stop(cause?: CoreEvent<any>) {
    this.events.emit(new StopEvent({}, cause));
  }

  protected matched(root: string, matchers: UnitMatcher[]) {
    const finder = new RecursiveFinder();
    const paths: string[] = [];

    for (const matcher of matchers) {
      const found = finder.find(root, matcher, (path) => path);

      if (found) {
        paths.push(found);
      }
    }

    console.log(paths);

    return paths;
  }
}

