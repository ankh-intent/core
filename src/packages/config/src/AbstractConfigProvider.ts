import * as yargs from 'yargs';

import { BubblingFinder } from '../../source';

export abstract class AbstractConfigProvider<O, C> {
  private _argv;
  private readonly _defaults: Partial<O>;

  public constructor(defaults: Partial<O>) {
    this._defaults = defaults;
  }

  protected defaults(): Partial<O> {
    return this._defaults;
  }

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

  protected usage(): string {
    const finder = new BubblingFinder();
    const data = finder.find(process.cwd(), { pattern: /package\.json$/ }, require);

    if (!data) {
      throw new Error('Can\'t find "package.json" file');
    }

    return `${data.name} ${data.version}\n` +
      `${data.description}\n` +
      `Usage: ${data.name} [<options>] [<entry>]`
      ;
  }

  protected abstract options(def: Partial<O>): any;
  public abstract build(core: C): O;
}
