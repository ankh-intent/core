
import * as path from 'path';
import * as yargs from 'yargs';
import { Core, CoreOptions } from '../src/Core';
import { WatchdogOptions } from '../src/intent-watchdog/core/Watchdog';
import { UnitMatcher } from '../src/intent-watchdog/core/matcher/UnitMatcher';
import { ResolverOptions } from '../src/core/chips/UseResolver';

abstract class AbstractOptions<O> {
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
          {group},
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

class IntentOptions extends AbstractOptions<CoreOptions> {
  protected usage(): string {
    const pckg = require("../../package.json");

    return `
      intent ${pckg.version}
      Usage: intent [<options>] [<entry>]
  `.trim();
  }

  protected options(defaults: CoreOptions): any {
    let regexp = (r: RegExp|string) => {
        return (typeof r === 'string')
          ? r
          : String(r).replace('\\\\', '\\');
    };

    return {
      "Watchdog options:": {
        "watch": {
          "type": "boolean",
          "alias": "w",
          "describe": "Watch for changes",
          "default": false,
          "requiresArg": false,
        },
        "watch-root": {
          "type": "string",
          "describe": "Set root directory to watch for changes",
          "default": defaults.watch.root,
          "requiresArg": true,
        },
        "watch-ignore": {
          "type": "string",
          "describe": "Set pattern for files to ignore",
          "default": regexp(defaults.watch.ignore),
          "requiresArg": true,
        },
        "watch-aggregation": {
          "type": "number",
          "describe": "Set changes debounce time interval",
          "default": defaults.watch.aggregation,
          "requiresArg": true,
        },
      },
    };
  }

  protected files(core: Core): UnitMatcher[] {
    return this.get('entry').map((pattern) => ({
      event: 'change',
      pattern: eval(pattern),
    }));
  }

  protected watch(core: Core): WatchdogOptions {
    return this.get("watch") && {
      root: this.get("watch-root"),
      ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
      aggregation: this.get("watch-aggregation"),
    };
  }

  protected resolver(core: Core): ResolverOptions {
    return {
      paths: {
        project: __dirname.replace('/build/', '/'),
      },
    };
  }

  public build(core: Core): CoreOptions {
    return {
      files: this.files(core),
      watch: this.watch(core),
      resolver: this.resolver(core),
    };
  }

  protected defaults(): CoreOptions {
    return {
      files: [
        {
          event: '',
          pattern: /\\.int$/ig,
        }
      ],
      watch: {
        root: process.cwd(),
        aggregation: 200,
        ignore: /[\\/]\./,
      },
      resolver: {
        paths: {
          intent: path.resolve(
            path.join(__dirname.replace('/build/', '/'), 'core/intent/specification/lib/')
          ),
          project: null,
          output: null,
        }
      },
    };
  }
}

export default (core: Core) => {
  return (new IntentOptions()).build(core);
};
