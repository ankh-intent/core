
import * as chokidar from 'chokidar';

import { Eventable } from '../../../../intent-utils/Eventable';
import { ArrayConsumer } from '../../../../intent-utils/ArrayConsumer';
import { Emitter } from '../../../../intent-utils/Emitter';

import { UnitInterface } from './Unit';
import { UnitMatcher } from './matcher/UnitMatcher';
import { WatchdogConfig } from './Watchdog';
import { AggregatedEmitter } from './AggregatedEmitter';

export class WatchItem<U extends UnitInterface> extends Eventable {
  public static EVENT  = 'event';
  public static DETACH = 'detach';

  private watcher: any;
  private debounced: number;
  private readonly matcher: UnitMatcher;
  private _emitter: Emitter<ArrayConsumer<U>>;

  public readonly uid: number;

  public constructor(uid: number, matcher: UnitMatcher) {
    super();
    this.uid = uid;
    this.matcher = matcher;
  }

  public get active(): boolean {
    return !!this.watcher;
  }

  public watch(config: WatchdogConfig): this {
    if (this.active) {
      return this;
    }

    let { pattern, event } = this.matcher;
    let strict = !(pattern instanceof RegExp);
    let bound = this.event.bind(this, event);
    let handler = bound;

    if (!strict) {
      handler = (path: string, ...rest) => {
        if (!path.match(<RegExp>pattern)) {
          return;
        }

        return bound(path, ...rest);
      };
    }

    this.watcher = chokidar
      .watch(strict ? (pattern as string) : config.root, {
        ignored: config.ignore,
        persistent: true,
        ignoreInitial: true,
      })
      .on(event, handler);

    return this;
  }

  public detach(): this {
    if (this.active) {
      this.watcher.close();
      this.watcher = null;
      this.emit(WatchItem.DETACH);
      this.off();
    }

    return this;
  }

  protected event(event: string, path: string, ...payload) {
    let data = { event, path, payload };

    this.emitter.emit([data]);
    this.emit(WatchItem.EVENT, data);
  }

  public debounce(delay: number) {
    if ((delay !== this.debounced) && this._emitter) {
      this.emitter = null;
    }

    this.debounced = delay;

    return this;
  }

  public get emitter(): Emitter<ArrayConsumer<U>> {
    if (!this._emitter) {
      if (this.debounced) {
        this._emitter = new AggregatedEmitter(this.debounced);
      } else {
        this._emitter = new Emitter();
      }
    }

    return this._emitter;
  }

  public set emitter(emitter: Emitter<ArrayConsumer<U>>) {
    if (this._emitter === emitter) {
      return;
    }

    if (this._emitter) {
      this._emitter.off();
    }

    this._emitter = emitter;
  }
}
