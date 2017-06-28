
import * as yargs from 'yargs';
import { Core, CoreOptions } from '../src/Core';
import { WatchdogOptions } from '../src/intent-watchdog/core/Watchdog';
import { UnitMatcher } from '../src/intent-watchdog/core/matcher/UnitMatcher';
import { ResolverOptions } from '../src/core/chips/UseResolver';

class Options {
  private yargs;
  private _argv;

  public constructor() {
    this.yargs = yargs;
  }

  protected argv() {
    let map = this.options();
    let options = {};

    for (let group in map) {
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

  public usage(): string {
    return '';
  }

  protected strict(): boolean {
    return true;
  }

  protected options() {
    return {};
  }

  public get(option?: string) {
    let argv = this._argv
      ? this._argv
      : this._argv = this.argv();

    return option
      ? argv[option]
      : argv;
  }
}

class IntentOptions extends Options {
  public usage(): string {
    const pckg = require("../../package.json");

    return `
      intent ${pckg.version}
      Usage: intent [<options>] [<entry>]
  `.trim();
  }

  protected options() {
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
          "default": process.cwd(),
          "requiresArg": true,
        },
        "watch-ignore": {
          "type": "string",
          "describe": "Set pattern for files to ignore",
          "default": "[/\\]\\.",
          "requiresArg": true,
        },
        "watch-aggregation": {
          "type": "number",
          "describe": "Set changes debounce time interval",
          "default": 200,
          "requiresArg": true,
        },
      },
    };
  }

  protected files(core: Core): UnitMatcher[] {
    return [
      {
        event: 'change',
        pattern: /\.int$/ig,
      }
    ];
  }

  protected watch(core: Core): WatchdogOptions {
    return this.get("watch") && {
      root: this.get("watch-root"),
      ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
      aggregation: this.get("watch-aggregation"),
    };
  }

  protected resolver(core: Core): ResolverOptions {
    return{
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
    }
  }
}

export default (core: Core) => {
  return (new IntentOptions()).build(core);
};
