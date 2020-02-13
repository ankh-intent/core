import { Emitter, Logger, UnitMatcher } from '@intent/utils';
import { RecursiveFinder } from '@intent/source';

import { ErrorConsumer, StatConsumer, UpdateEvent, EventChainMonitor } from './consumers';
import { CoreConfig } from './CoreConfig';
import { TreeNode } from './kernel/ast';

import { Identifiable } from './kernel/dependencies';
import { CoreEvent, CoreEventBus, EventChainInterface, FatalEvent, ReadyEvent, StopEvent } from './kernel/event';

import { CoreLogger } from './kernel/logging/CoreLogger';
import { PipelineObserverFactory } from './PipelineObserver';

type CoreEventEmitter<T> = (event: CoreEvent<T>) => any;

export interface ConfigFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: CoreConfig): C;
}

export class Core<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> extends Emitter<CoreEventEmitter<any>> {
  private readonly eventChainMonitor: EventChainMonitor<CoreEvent>;

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
      .add(new ErrorConsumer(this.events, resolved, this.logger))
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
    const updates: CoreEvent[] = [];

    for (const [name, entry] of Object.entries(config.entry)) {
      updates.push(
        ...this
          .matched(entry.path, entry.test)
          .map((path) => new UpdateEvent({ path, entry: name }))
      )
    }

    this.eventChainMonitor
      .monitor(updates)
      .once((data: EventChainInterface) => {
        this.events.emit(new ReadyEvent(data))
      })
    ;

    for (const update of updates) {
      this.events.emit(update);
    }

    return this;
  }

  public stop(cause?: CoreEvent) {
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

