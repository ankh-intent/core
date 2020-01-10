import { watch, FSWatcher } from 'chokidar';

import { Eventable } from '../../utils/Eventable';
import { ArrayConsumer } from '../../utils/ArrayConsumer';
import { Emitter } from '../../utils/Emitter';

import { UnitInterface } from './Unit';
import { UnitMatcher } from '../../utils/UnitMatcher';
import { WatchdogConfig } from './Watchdog';
import { AggregatedEmitter } from './AggregatedEmitter';

export class WatchItem<U extends UnitInterface> extends Eventable {
  public static EVENT  = 'event';
  public static DETACH = 'detach';

  private watcher: FSWatcher|null = null;
  private debounced: number;
  private readonly matcher: UnitMatcher;
  private _emitter: Emitter<ArrayConsumer<U>>|null;

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

    const { pattern, event } = this.matcher;
    const strict = !(pattern instanceof RegExp);
    const bound = this.event.bind(this, event);
    let handler = bound;

    if (!strict) {
      handler = (path: string, ...rest) => {
        if (!path.match(<RegExp>pattern)) {
          return;
        }

        return bound(path, ...rest);
      };
    }

    this.watcher = watch(strict ? (pattern as string) : config.root, {
        ignored: config.ignore,
        persistent: true,
        ignoreInitial: true,
      })
      .on(event, handler)
    ;

    return this;
  }

  public detach(): this {
    if (this.active) {
      if (this.watcher) {
        this.watcher.close();
        this.watcher = null;
      }

      this.emit(WatchItem.DETACH);
      this.off();
    }

    return this;
  }

  protected event(event: string, path: string, ...payload) {
    const data = { event, path, payload };

    this._emitter && this._emitter.emit([data]);
    this.emit(WatchItem.EVENT, data);
  }

  public debounce(delay: number) {
    if ((delay !== this.debounced) && this._emitter) {
      this.setEmitter(null);
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

  public setEmitter(emitter: Emitter<ArrayConsumer<U>>|null) {
    if (this._emitter === emitter) {
      return;
    }

    if (this._emitter) {
      this._emitter.off();
    }

    this._emitter = emitter;
  }
}
