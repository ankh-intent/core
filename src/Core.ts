
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { WatchItem } from './intent-watchdog/core/WatchItem';
import { UnitInterface } from './intent-watchdog/core/Unit';

import { IntentBuilder } from './core/intent/builder/IntentBuilder';

import { CoreEventBus } from './core/flow/CoreEventBus';
import { UpdateEvent } from './core/flow/events/UpdateEvent';
import { CoreEvent } from './core/flow/CoreEvent';
import { Emitter } from './intent-utils/Emitter';

import { SubmitConsumer } from './core/flow/consumers/SubmitConsumer';
import { ParsedConsumer } from './core/flow/consumers/ParsedConsumer';
import { CompiledConsumer } from './core/flow/consumers/CompiledConsumer';
import { UpdateConsumer } from './core/flow/consumers/UpdateConsumer';
import { InterpretConsumer } from './core/flow/consumers/InterpretConsumer';
import { StatConsumer } from './core/flow/consumers/StatConsumer';
import { ErrorConsumer } from './core/flow/consumers/ErrorConsumer';
import { InterpretedConsumer } from './core/flow/consumers/InterpretedConsumer';
import { FatalEvent } from './core/flow/events/FatalEvent';

export interface CoreOptions {
  files: UnitMatcher[]
  watch?: WatchdogOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  private watchdog: Watchdog<UnitInterface>;
  private watches: WatchItem<UnitInterface>[];

  private files: UnitMatcher[];

  private parser: IntentBuilder;
  private events: CoreEventBus;

  public constructor() {
    super();
    this.watches = [];
    this.parser = new IntentBuilder();

    this.events = new CoreEventBus();
    this.events
      .add(new UpdateConsumer(this.events))
      .add(new SubmitConsumer(this.events, this.parser))
      .add(new ParsedConsumer(this.events))
      .add(new CompiledConsumer(this.events))
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
  }

  public bootstrap(options: CoreOptions): Core {
    let watch;

    this.files = options.files;

    if (watch = options.watch) {
      this.watchdog = new Watchdog(watch);

      this.watch(this.files);
    }

    if (this.watchdog) {
      this.watchdog.start(this.watches);
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

      this.watches.push(watcher);
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

