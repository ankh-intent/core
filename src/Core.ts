
import { ResolverOptions } from './core/chips/ResolverOptions';
import { OptionsResolver } from './OptionsResolver';

import { Emitter } from './intent-utils/Emitter';
import { Logger } from './intent-utils/Logger';
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { UnitInterface } from './intent-watchdog/core/Unit';

import { IntentBuilder } from './core/intent/builder/IntentBuilder';

import { CoreEventBus } from './core/flow/CoreEventBus';
import { UpdateEvent } from './core/flow/events/UpdateEvent';
import { CoreEvent } from './core/flow/CoreEvent';
import { FatalEvent } from './core/flow/events/FatalEvent';
import { FileWriter } from './core/source/FileWriter';
import { Finder } from './core/source/Finder';

import { SubmitConsumer } from './core/flow/consumers/SubmitConsumer';
import { ParsedConsumer } from './core/flow/consumers/ParsedConsumer';
import { CompiledConsumer } from './core/flow/consumers/compiled/CompiledConsumer';
import { UpdateConsumer } from './core/flow/consumers/UpdateConsumer';
import { DependencyModifiedConsumer, InterpreterOptions } from './core/flow/consumers/transpiling/DependencyModifiedConsumer';
import { StatConsumer } from './core/flow/consumers/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { InterpretedConsumer } from './core/flow/consumers/InterpretedConsumer';
import { WatchdogReadyConsumer } from './core/flow/consumers/WatchdogReadyConsumer';
import { ReadyEvent } from './core/flow/events/ReadyEvent';
import { EventChainMonitor, EventChainMonitoringData } from './core/flow/consumers/EventChainMonitor';
import { FileEmitResolver } from './core/chips/FileEmitResolver';
import { IntentLogger } from './core/IntentLogger';
import { DummyWriter } from "./core/source/DummyWriter";
import { DependencyManager } from './core/watchdog/dependencies/DependecyManager';

export interface EmitOptions {
  files: boolean;
  stats: boolean
  options: boolean;
  extension: string;
}

export interface CoreOptions {
  emit: EmitOptions;
  files: UnitMatcher[];
  watch?: WatchdogOptions;
  resolver: ResolverOptions;
  interpreter: InterpreterOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  private files: UnitMatcher[];
  private watchdog: Watchdog<UnitInterface>;

  private options: OptionsResolver;
  private parser: IntentBuilder;
  private events: CoreEventBus;

  private eventChainMonitor: EventChainMonitor<CoreEvent<any>>;
  private dependencyTree: DependencyManager;

  public logger: Logger;

  public constructor() {
    super();
    this.logger = new IntentLogger();
    this.options= new OptionsResolver();
    this.parser = new IntentBuilder();
    this.events = new CoreEventBus();
  }

  public bootstrap(options: CoreOptions): CoreOptions {
    let resolved = this.options.resolve(options);
    let writer = resolved.emit.files ? new FileWriter() : new DummyWriter();

    this.files = resolved.files;

    if (resolved.watch) {
      this.watchdog = new Watchdog(resolved.watch);

      this.watch(this.files);
    }

    this.eventChainMonitor = new EventChainMonitor(this.events);
    this.dependencyTree = new DependencyManager();

    this.events
      .add(this.eventChainMonitor)
      .add(new UpdateConsumer(this.events))
      .add(new SubmitConsumer(this.events, this.parser))
      .add(new ParsedConsumer(this.events, this.dependencyTree))
      .add(new CompiledConsumer(this.events, resolved.resolver, this.dependencyTree))
      .add(new DependencyModifiedConsumer(this.events, resolved))
      .add(new InterpretedConsumer(this.events, new FileEmitResolver(resolved), writer))
      .add(new ErrorConsumer(this.events, this.logger))
      .add(new StatConsumer(this.events, resolved, this.logger))
      .add(this.eventChainMonitor)
    ;

    return resolved;
  }

  public start(options: CoreOptions): this {
    let updates = this.matched(
      options.resolver.paths.project,
      options.files
    ).map((path) => {
      return new UpdateEvent({path})
    });

    this.eventChainMonitor
      .monitor(updates)
      .once((data: EventChainMonitoringData) => {
        this.events.emit(new ReadyEvent(data))
      })
    ;

    if (this.watchdog) {
      this.events
        .add(new WatchdogReadyConsumer(this.events, this.watchdog))
      ;
    }

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

  protected watch(files: UnitMatcher[]) {
    let watchers = files.map((file) => this.watchdog.watch(file));

    for (let watcher of watchers) {
      watcher.emitter
        .and(this.event.bind(this))
      ;
    }
  }

  protected event(data) {
    for (let { event, path } of data) {
      switch (event) {

        case 'change':
          return this.events.emit(new UpdateEvent({
            path,
          }));

      }
    }
  }
}

