
import { UnitMatcher, Watchdog, WatchItem } from 'intent-watchdog';

export interface WatchOptions {
  debounce: number;
}

export interface CoreOptions {
  files: UnitMatcher[]
  watch?: WatchOptions;
}

export class Core {
  private watchdog: Watchdog;
  private watches: WatchItem[];

  private files: UnitMatcher[];

  public constructor() {
    this.watchdog = new Watchdog();
    this.watches = [];
  }

  public bootstrap(options: CoreOptions): Core {
    let watch;

    this.files = options.files;

    if (watch = options.watch) {
      if (watch.debounce) {
        this.watchdog.debounce(watch.debounce)
      }

      this.watch(this.files);
    }

    return this;
  }

  protected watch(files: UnitMatcher[]) {
    for (let file of files) {
      this.watches.push(
        this.watchdog.watch(file)
      );
    }
  }
}
