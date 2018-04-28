
import { ResolverConfig } from './intent-core/chips/ResolverConfig';
import { ConfigResolver } from './ConfigResolver';

import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';
import { UnitMatcher } from './core/consumers/watching/watchdog/matcher/UnitMatcher';
import { Watchdog, WatchdogConfig } from './core/consumers/watching/watchdog/Watchdog';
import { UnitInterface } from './core/consumers/watching/watchdog/Unit';

import { IntentBuilder } from './core/consumers/interpreting/intent/builder/IntentBuilder';

import { CoreEventBus } from './core/kernel/event/CoreEventBus';
import { UpdateEvent } from './core/consumers/watching/UpdateEvent';
import { CoreEvent } from './core/kernel/event/CoreEvent';
import { FatalEvent } from './core/kernel/event/events/FatalEvent';
import { FileWriter } from './core/consumers/reading/source/FileWriter';
import { Finder } from './core/consumers/reading/source/Finder';

import { SubmitConsumer } from './core/consumers/parsing/SubmitConsumer';
import { ParsedConsumer } from './core/consumers/ast-compiling/ParsedConsumer';
import { CompiledConsumer } from './core/consumers/watching/CompiledConsumer';
import { UpdateConsumer } from './core/consumers/reading/UpdateConsumer';
import { DependencyModifiedConsumer, InterpreterConfig } from './core/consumers/interpreting/DependencyModifiedConsumer';
import { StatConsumer } from './core/consumers/stat/StatConsumer';
import { ErrorConsumer } from './core/consumers/errors/ErrorConsumer';
import { InterpretedConsumer } from './core/consumers/emitting/InterpretedConsumer';
import { WatchdogReadyConsumer } from './core/consumers/watching/WatchdogReadyConsumer';
import { ReadyEvent } from './core/kernel/event/events/ReadyEvent';
import { EventChainMonitor, EventChainMonitoringData } from './core/kernel/event/EventChainMonitor';
import { FileEmitResolver } from './intent-core/chips/FileEmitResolver';
import { CoreLogger } from './core/kernel/logging/CoreLogger';
import { DummyWriter } from './core/consumers/reading/source/DummyWriter';
import { DependencyManager } from './core/consumers/watching/watchdog/dependencies/DependencyManager';
import { QualifierResolver } from './intent-core/chips/qualifier/QualifierResolver';

export interface EmitConfig {
  files: boolean;
  stats: boolean
  config: boolean;
  extension: string;
}

export interface CoreConfig {
  emit: EmitConfig;
  files: UnitMatcher[];
  resolver: ResolverConfig;
  interpreter: InterpreterConfig;
  watch?: WatchdogConfig;
}

type CoreEventEmitter<T> = (event: CoreEvent<T>) => any;

export class Core extends Emitter<CoreEventEmitter<any>> {
  private watchdog: Watchdog<UnitInterface>;

  private readonly config: ConfigResolver;
  private readonly parser: IntentBuilder;
  private readonly events: CoreEventBus;

  private readonly eventChainMonitor: EventChainMonitor<CoreEvent<any>>;
  private readonly dependencyTree: DependencyManager;

  public readonly logger: Logger;

  public constructor() {
    super();
    this.logger = new CoreLogger();
    this.config= new ConfigResolver();
    this.parser = new IntentBuilder();
    this.events = new CoreEventBus();
    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();
  }

  public bootstrap(config: CoreConfig): CoreConfig {
    const resolved = this.config.resolve(config);
    const writer = resolved.emit.files ? new FileWriter() : new DummyWriter();

    if (resolved.watch) {
      this.watchdog = new Watchdog(resolved.watch);
    }

    this.events.reset();
    this.events.add(this.eventChainMonitor);

    this.events
      .add(new UpdateConsumer(this.events))
      .add(new SubmitConsumer(this.events, this.parser))
      .add(new ParsedConsumer(this.events, new QualifierResolver(resolved.resolver), this.dependencyTree))
      .add(new CompiledConsumer(this.events, resolved.resolver, this.dependencyTree))
      .add(new DependencyModifiedConsumer(this.events, resolved))
      .add(new InterpretedConsumer(this.events, new FileEmitResolver(resolved), writer))
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
    ;

    if (this.watchdog) {
      this.events.add(new WatchdogReadyConsumer(this.events, this.watchdog, this.dependencyTree));
    }

    this.events.add(this.eventChainMonitor);

    return resolved;
  }

  public start(config: CoreConfig): this {
    let updates = this
      .matched(config.resolver.paths.project, config.files)
      .map((path) => new UpdateEvent({ path }))
    ;

    this.eventChainMonitor
      .monitor(updates)
      .once((data: EventChainMonitoringData) => {
        this.events.emit(new ReadyEvent(data))
      })
    ;

    this.events
      .add({
        consume: (event) => {
          if (event instanceof FatalEvent) {
            this.stop();
          }

          this.emit(event);
        }
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

    return paths;
  }
}

