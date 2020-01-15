
import * as yargs from 'yargs';

export abstract class AbstractConfigProvider<O> {
  private _argv;

  protected argv() {
    const map = this.options(
      this.defaults()
    );
    const options = {};

    for (const group in map) {
      if (!map.hasOwnProperty(group)) {
        continue;
      }

      for (const option of Object.keys(map[group])) {
        options[option] = Object.assign(
          { group: group + ':', },
          map[group][option]
        );
      }
    }

    const built = yargs
      .usage(this.usage())
      .help("help")
      .version()
      .alias("help", "h")
      .alias("version", "v")
      .options(options)
    ;

    return this.strict()
      ? built.strict().argv
      : built.argv;
  }

  protected strict(): boolean {
    return true;
  }

  public get(option?: string) {
    const argv = this._argv
      ? this._argv
      : this._argv = this.argv();

    return option
      ? argv[option]
      : argv;
  }

  protected abstract usage(): string;
  protected abstract defaults(): Partial<O>;
  protected abstract options(def: Partial<O>): any;
}
