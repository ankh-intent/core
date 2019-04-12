
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

export interface PipelineObserver<C extends CoreConfig> {
  attach(core: Core<C>, config: CoreConfig): C;
  bootstrap(core: Core<C>, config: C): void;
}

export class Core<C extends CoreConfig> extends Emitter<CoreEventEmitter<any>> {
  private watchdog: Watchdog<UnitInterface>;

  private readonly eventChainMonitor: EventChainMonitor<CoreEvent<any>>;

  public readonly events: CoreEventBus;
  public readonly dependencyTree: DependencyManager;
  public readonly logger: Logger;

  public constructor() {
    super();
    this.logger = new CoreLogger();
    this.events = new CoreEventBus();
    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();
  }

  public bootstrap(config: CoreConfig, compiler: PipelineObserver<C>): C {
    const resolved = compiler.attach(this, config);

    if (resolved.watch) {
      this.watchdog = new Watchdog(resolved.watch);
    }

    this.events.reset();
    this.events.add(this.eventChainMonitor);

    compiler.bootstrap(this, resolved);

    this.events
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
    ;

    if (this.watchdog) {
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

