
import { ResolverOptions } from './core/chips/UseResolver';
import { OptionsResolver } from './OptionsResolver';

import { Emitter } from './intent-utils/Emitter';
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
import { CompiledConsumer } from './core/flow/consumers/CompiledConsumer';
import { UpdateConsumer } from './core/flow/consumers/UpdateConsumer';
import { InterpretConsumer, InterpreterOptions } from './core/flow/consumers/transpiling/InterpretConsumer';
import { StatConsumer } from './core/flow/consumers/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { InterpretedConsumer } from './core/flow/consumers/InterpretedConsumer';

export interface CoreOptions {
  files: UnitMatcher[]
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

  public constructor() {
    super();
    this.options= new OptionsResolver();
    this.parser = new IntentBuilder();
    this.events = new CoreEventBus();
  }

  public bootstrap(options: CoreOptions): CoreOptions {
    let resolved = this.options.resolve(options);

    this.files = resolved.files;
    let watch;

    if (watch = resolved.watch) {
      this.watchdog = new Watchdog(watch);

      this.watch(this.files);
    }

    this.events
      .add(new UpdateConsumer(this.events))
      .add(new SubmitConsumer(this.events, this.parser))
      .add(new ParsedConsumer(this.events))
      .add(new CompiledConsumer(this.events, resolved.resolver))
      .add(new InterpretConsumer(this.events, resolved.interpreter))
      .add(new InterpretedConsumer(this.events, new FileWriter()))
      .add(new ErrorConsumer(this.events))
      .add(new StatConsumer(this.events, resolved))
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

  public start(options: CoreOptions): this {
    let finder = new Finder();
    let root = options.resolver.paths.project;

    for (let matcher of options.files) {
      let found = finder.find(root, matcher, (path) => new UpdateEvent({path}));

      if (found) {
        this.events.emit(found);
      }
    }

    if (this.watchdog) {
      this.watchdog.start();

      setTimeout(() => {
        this.events.stat({
          type: 'ready',
        });
      }, 100);
    }

    return this;
  }

  public stop() {
    if (this.watchdog) {
      this.watchdog.stop();
    }
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

