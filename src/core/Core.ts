
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { Identifiable } from '@intent/kernel/watchdog/dependencies/DependencyNode';
import { Emitter } from './utils/Emitter';
import { Logger } from './utils/Logger';
import { UnitMatcher } from './kernel/watchdog/matcher/UnitMatcher';
import { Watchdog, WatchdogConfig } from './kernel/watchdog/Watchdog';
import { UnitInterface } from './kernel/watchdog/Unit';

import { CoreEventBus } from './kernel/event/CoreEventBus';
import { UpdateEvent } from './consumers/watching/UpdateEvent';
import { CoreEvent } from './kernel/event/CoreEvent';
import { FatalEvent } from './kernel/event/events/FatalEvent';
import { Finder } from './kernel/source/Finder';

import { StatConsumer } from './consumers/stat/StatConsumer';
import { ErrorConsumer } from './consumers/errors/ErrorConsumer';
import { WatchdogReadyConsumer } from './consumers/watching/WatchdogReadyConsumer';
import { ReadyEvent } from './kernel/event/events/ReadyEvent';
import { EventChainMonitor, EventChainMonitoringData } from './kernel/event/EventChainMonitor';
import { CoreLogger } from './kernel/logging/CoreLogger';
import { DependencyManager } from './kernel/watchdog/dependencies/DependencyManager';
import { Container } from './utils/Container';

export interface PathsConfig {
  project: string;
}

export interface EntryConfig {
  path: string;
  test: UnitMatcher[];
}

export interface EmitConfig {
  files: boolean;
  stats: boolean
  config: boolean;
}

export interface CoreConfig {
  paths: PathsConfig;
  entry: Container<EntryConfig>;
  emit: EmitConfig;
  watch?: WatchdogConfig;
}

type CoreEventEmitter<T> = (event: CoreEvent<T>) => any;

export interface ConfigFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: CoreConfig): C;
}

export interface PipelineObserverFactory<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  (core: Core<C, N, T>, config: C): PipelineObserver<C, N, T>;
}

export interface PipelineObserver<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> {
  bootstrap(core: Core<C, N, T>, config: C): void;
}

export class Core<C extends CoreConfig, N extends TreeNode, T extends Identifiable<N>> extends Emitter<CoreEventEmitter<any>> {
  private watchdog: Watchdog<UnitInterface>;

  private readonly eventChainMonitor: EventChainMonitor<CoreEvent<any>>;

  public readonly events: CoreEventBus;
  public readonly dependencyTree: DependencyManager<N, T>;
  public readonly logger: Logger;

  public constructor() {
    super();
    this.logger = new CoreLogger();
    this.events = new CoreEventBus();
    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();
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
    ;

    if (resolved.watch) {
      this.watchdog = new Watchdog(resolved.watch);
      this.events.add(new WatchdogReadyConsumer(this.events, this.watchdog, this.dependencyTree));
    }

    this.events
      .add(this.eventChainMonitor)
      .add({
        consume: (event) => {
          if (event instanceof FatalEvent) {
            this.stop();
          }

          this.emit(event);
        }
      })
    ;

    return resolved;
  }

  public start(config: C): this {
    const updates = [];

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

  public stop() {
    if (this.watchdog) {
      this.watchdog.stop();
    }
  }

  protected matched(root: string, matchers: UnitMatcher[]) {
    const finder = new Finder();
    const paths = [];

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

