
import * as yargs from 'yargs';

export abstract class AbstractOptionsProvider<O> {
  private yargs;
  private _argv;

  public constructor() {
    this.yargs = yargs;
  }

  protected argv() {
    let map = this.options(
      this.defaults()
    );
    let options = {};

    for (let group in map) {
      if (!map.hasOwnProperty(group)) {
        continue;
      }

      for (let option of Object.keys(map[group])) {
        options[option] = Object.assign(
          { group: group + ':', },
          map[group][option]
        );
      }
    }

    let built = yargs
      .usage(this.usage())
      .help("help")
      .alias("help", "h")
      .version()
      .alias("version", "v")
      .options(options)
    ;

    if (this.strict()) {
      built = built.strict();
    }

    return built.argv;
  }

  protected strict(): boolean {
    return true;
  }

  public get(option?: string) {
    let argv = this._argv
      ? this._argv
      : this._argv = this.argv();

    return option
      ? argv[option]
      : argv;
  }

  protected abstract usage(): string;
  protected abstract defaults(): O;
  protected abstract options(def: O): any;
}
