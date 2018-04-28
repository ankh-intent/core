
import { ResolverOptions } from './intent-core/chips/ResolverOptions';
import { OptionsResolver } from './OptionsResolver';

import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { UnitInterface } from './intent-watchdog/core/Unit';

import { IntentBuilder } from './intent-core/intent/builder/IntentBuilder';

import { CoreEventBus } from './intent-core/flow/CoreEventBus';
import { UpdateEvent } from './intent-core/flow/events/UpdateEvent';
import { CoreEvent } from './intent-core/flow/CoreEvent';
import { FatalEvent } from './intent-core/flow/events/FatalEvent';
import { FileWriter } from './intent-core/source/FileWriter';
import { Finder } from './intent-core/source/Finder';

import { SubmitConsumer } from './intent-core/flow/consumers/SubmitConsumer';
import { ParsedConsumer } from './intent-core/flow/consumers/ParsedConsumer';
import { CompiledConsumer } from './intent-core/flow/consumers/compiled/CompiledConsumer';
import { UpdateConsumer } from './intent-core/flow/consumers/UpdateConsumer';
import { DependencyModifiedConsumer, InterpreterOptions } from './intent-core/flow/consumers/transpiling/DependencyModifiedConsumer';
import { StatConsumer } from './intent-core/flow/consumers/stat/StatConsumer';
import { ErrorConsumer } from './intent-core/flow/consumers/ErrorConsumer';
import { InterpretedConsumer } from './intent-core/flow/consumers/InterpretedConsumer';
import { WatchdogReadyConsumer } from './intent-core/flow/consumers/WatchdogReadyConsumer';
import { ReadyEvent } from './intent-core/flow/events/ReadyEvent';
import { EventChainMonitor, EventChainMonitoringData } from './intent-core/flow/consumers/EventChainMonitor';
import { FileEmitResolver } from './intent-core/chips/FileEmitResolver';
import { IntentLogger } from './intent-core/IntentLogger';
import { DummyWriter } from "./intent-core/source/DummyWriter";
import { DependencyManager } from './intent-core/watchdog/dependencies/DependencyManager';
import { QualifierResolver } from './intent-core/chips/qualifier/QualifierResolver';

export interface EmitOptions {
  files: boolean;
  stats: boolean
  options: boolean;
  extension: string;
}

export interface CoreOptions {
  emit: EmitOptions;
  files: UnitMatcher[];
  resolver: ResolverOptions;
  interpreter: InterpreterOptions;
  watch?: WatchdogOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  private watchdog: Watchdog<UnitInterface>;

  private readonly options: OptionsResolver;
  private readonly parser: IntentBuilder;
  private readonly events: CoreEventBus;

  private readonly eventChainMonitor: EventChainMonitor<CoreEvent<any>>;
  private readonly dependencyTree: DependencyManager;

  public readonly logger: Logger;

  public constructor() {
    super();
    this.logger = new IntentLogger();
    this.options= new OptionsResolver();
    this.parser = new IntentBuilder();
    this.events = new CoreEventBus();
    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();
  }

  public bootstrap(options: CoreOptions): CoreOptions {
    const resolved = this.options.resolve(options);
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

  public start(options: CoreOptions): this {
    let updates = this
      .matched(options.resolver.paths.project, options.files)
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

