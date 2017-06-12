
import { Emitter } from './intent-utils/Emitter';
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { UnitInterface } from './intent-watchdog/core/Unit';

import { IntentBuilder } from './core/intent/builder/IntentBuilder';

import { CoreEventBus } from './core/flow/CoreEventBus';
import { UpdateEvent } from './core/flow/events/UpdateEvent';
import { CoreEvent } from './core/flow/CoreEvent';
import { FatalEvent } from './core/flow/events/FatalEvent';
import { StatEvent } from './core/flow/events/StatEvent';

import { SubmitConsumer } from './core/flow/consumers/SubmitConsumer';
import { ParsedConsumer } from './core/flow/consumers/ParsedConsumer';
import { CompiledConsumer } from './core/flow/consumers/CompiledConsumer';
import { UpdateConsumer } from './core/flow/consumers/UpdateConsumer';
import { InterpretConsumer } from './core/flow/consumers/InterpretConsumer';
import { StatConsumer } from './core/flow/consumers/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { InterpretedConsumer } from './core/flow/consumers/InterpretedConsumer';
import { ResolverOptions } from './core/chips/UseResolver';
import { OptionsResolver } from './OptionsResolver';

export interface CoreOptions {
  files: UnitMatcher[]
  watch?: WatchdogOptions;
  resolver: ResolverOptions;
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
      .add(new InterpretConsumer(this.events))
      .add(new InterpretedConsumer(this.events))
      .add(new ErrorConsumer(this.events))
      .add(new StatConsumer(this.events))
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

  public start(): this {
    if (this.watchdog) {
      this.watchdog.start();
    }

    this.events.emit(new StatEvent({
      stat: 'ready',
    }));

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

