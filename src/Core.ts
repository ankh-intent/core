
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { Watchdog, WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { WatchItem } from './intent-watchdog/core/WatchItem';
import { UnitInterface } from './intent-watchdog/core/Unit';
import { ChipNode } from './core/intent/ast/ChipNode';
import { ASTBuilder } from './core/ASTBuilder';
import { IntentASTBuilder } from './core/intent/IntentASTBuilder';

import { SubmitConsumer } from './core/flow/consumers/SubmitConsumer';
import { ParsedConsumer } from './core/flow/consumers/ParsedConsumer';
import { CompiledConsumer } from './core/flow/consumers/CompiledConsumer';
import { CoreEventBus } from './core/flow/CoreEventBus';
import { UpdateEvent } from './core/flow/events/UpdateEvent';
import { CoreEvent } from './core/flow/CoreEvent';
import { UpdateConsumer } from './core/flow/consumers/UpdateConsumer';
import { Emitter } from './intent-utils/Emitter';
import { InterpretConsumer } from './core/flow/consumers/InterpretConsumer';
import { StatConsumer } from './core/flow/consumers/StatConsumer';

export interface CoreOptions {
  files: UnitMatcher[]
  watch?: WatchdogOptions;
}

export class Core extends Emitter<(event: CoreEvent<any>) => any> {
  private watchdog: Watchdog<UnitInterface>;
  private watches: WatchItem<UnitInterface>[];

  private files: UnitMatcher[];

  private parser: ASTBuilder<ChipNode>;
  private events: CoreEventBus;

  public constructor() {
    super();
    this.watches = [];
    this.parser = new IntentASTBuilder();
    this.events = new CoreEventBus();
    this.events
      .add(new UpdateConsumer(this.events))
      .add(new SubmitConsumer(this.events, this.parser))
      .add(new ParsedConsumer(this.events))
      .add(new CompiledConsumer(this.events))
      .add(new InterpretConsumer(this.events))
      .add(new StatConsumer(this.events))
      .add({
        consume: (event) => {
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

