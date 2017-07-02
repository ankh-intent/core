

import { UnitMatcher } from './matcher/UnitMatcher';
import { UnitInterface } from './Unit';
import { WatchItem } from './WatchItem';

export interface WatchdogOptions {
  root: string;
  ignore: RegExp;
  aggregation: number;
}

export class Watchdog<U extends UnitInterface> {
  private uid: number = 0;
  private options: WatchdogOptions;
  private watches: {[index: number]: WatchItem<U>};

  public active: boolean;

  public constructor(options: WatchdogOptions) {
    this.watches = {};
    this.options = options;
    this.active = false;
  }

  public all(): WatchItem<U>[] {
    return Object.keys(this.watches).map((key) => this.watches[key]);
  }

  public start(items?: WatchItem<U>[]) {
    this.active = true;

    for (let item of items || this.all()) {
      item.watch(this.options);
    }
  }

  public stop() {
    if (!this.active) {
      return;
    }

    for (let item of this.all()) {
      item.detach();
    }
  }

  public watch(matcher: UnitMatcher): WatchItem<U> {
    let item = new WatchItem(++this.uid, matcher);

    item.once(WatchItem.DETACH, () => {
      delete this.watches[item.uid];
    });

    if (this.options.aggregation) {
      item.debounce(this.options.aggregation);
    }

    return this.watches[item.uid] = item;
  }
}
