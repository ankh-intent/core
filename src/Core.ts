
import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';
import { UnitMatcher } from './core/consumers/watching/watchdog/matcher/UnitMatcher';
import { Watchdog, WatchdogConfig } from './core/consumers/watching/watchdog/Watchdog';
import { UnitInterface } from './core/consumers/watching/watchdog/Unit';

import { CoreEventBus } from './core/kernel/event/CoreEventBus';
import { UpdateEvent } from './core/consumers/watching/UpdateEvent';
import { CoreEvent } from './core/kernel/event/CoreEvent';
import { FatalEvent } from './core/kernel/event/events/FatalEvent';
import { Finder } from './core/consumers/reading/source/Finder';

import { StatConsumer } from './core/consumers/stat/StatConsumer';
import { ErrorConsumer } from './core/consumers/errors/ErrorConsumer';
import { WatchdogReadyConsumer } from './core/consumers/watching/WatchdogReadyConsumer';
import { ReadyEvent } from './core/kernel/event/events/ReadyEvent';
import { EventChainMonitor, EventChainMonitoringData } from './core/kernel/event/EventChainMonitor';
import { CoreLogger } from './core/kernel/logging/CoreLogger';
import { DependencyManager } from './core/consumers/watching/watchdog/dependencies/DependencyManager';
import { Container } from './intent-utils/Container';

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

export interface Compiler<C extends CoreConfig> {
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

  public bootstrap(config: CoreConfig, compiler: Compiler<C>): C {
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

    for (let update of updates) {
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
    let finder = new Finder();
    let paths = [];

    for (let matcher of matchers) {
      let found = finder.find(root, matcher, (path) => path);

      if (found) {
        paths.push(found);
      }
    }

    console.log(paths);

    return paths;
  }
}

