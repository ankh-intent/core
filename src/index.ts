
import { Watchdog, WatchItem, WatchMatcher } from 'intent-watchdog';

export interface WatchOptions {
  files: WatchMatcher[]
}

export interface CoreOptions {
  watch: WatchOptions;
}

export class Core {
  private watchdog: Watchdog;

  private watches: WatchItem[];

  public constructor(options: CoreOptions) {
    this.watchdog = new Watchdog();

    this.watch(options.watch);
  }

  public watch(options: WatchOptions) {
    for (let file of options.files) {
      this.watches.push(
        this.watchdog.watch(file)
      );
    }
  }
}
