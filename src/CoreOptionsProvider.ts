
import { AbstractOptionsProvider } from './AbstractOptionsProvider';
import { Core, CoreOptions, EmitOptions } from './Core';
import { UnitMatcher } from './intent-watchdog/core/matcher/UnitMatcher';
import { WatchdogOptions } from './intent-watchdog/core/Watchdog';
import { ResolverOptions } from "./core/chips/use/ResolverOptions";
import { InterpreterOptions } from './core/flow/consumers/transpiling/InterpretConsumer';
import * as path from 'path';

export class CoreOptionsProvider extends AbstractOptionsProvider<CoreOptions> {
  private _defaults: CoreOptions;

  public constructor(defaults: CoreOptions) {
    super();
    this._defaults = defaults;
  }

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
      "Basic options": {
        "entry": {
          "type": "array",
          "alias": "e",
          "describe": "Patterns to capture entry files to process",
          "default": defaults.files.map((e) => regexp(e.pattern)),
          "requiresArg": true,
        },
        "work-dir": {
          "type": "string",
          "alias": "d",
          "describe": "Working directory to resolve as root for namespaces",
          "default": defaults.resolver.paths.project,
          "requiresArg": true,
        },
        "output-dir": {
          "type": "string",
          "describe": "Directory to output emitted files to",
          "default": defaults.resolver.paths.output,
          "requiresArg": true,
        },
      },
      "Emit options": {
        "output-emit-stat": {
          "type": "boolean",
          "describe": "Emit compilation stat event to console output",
          "default": defaults.emit.stats,
          "requiresArg": false,
        },
        "output-emit-options": {
          "type": "boolean",
          "describe": "Emit to console the options, reconciled form command-line",
          "default": defaults.emit.options,
          "requiresArg": false,
        },
        "output-extension": {
          "type": "string",
          "describe": "Extension to emit files with",
          "default": defaults.interpreter.emit.extension,
          "requiresArg": true,
        },
      },
      "Watchdog options": {
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

  protected emit(): EmitOptions {
    return {
      stats: this.get("output-emit-stats"),
      options: this.get("output-emit-options"),
    };
  }

  protected files(): UnitMatcher[] {
    return this.get('entry').map((pattern) => ({
      event: 'change',
      pattern: eval(pattern),
    }));
  }

  protected watch(): WatchdogOptions {
    return this.get("watch") && {
        root: this.get("watch-root"),
        ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
        aggregation: this.get("watch-aggregation"),
      };
  }

  protected resolver(): ResolverOptions {
    return {
      paths: {
        project: path.resolve(this.get("work-dir")),
        output: path.resolve(this.get("output-dir")),
      },
    };
  }

  protected interpreter(): InterpreterOptions {
    return {
      emit: {
        extension: this.get("output-extension"),
      },
    };
  }

  public build(core: Core): CoreOptions {
    return Object.assign(
      {},
      this.defaults(),
      <CoreOptions> {
        emit: this.emit(),
        files: this.files(),
        watch: this.watch(),
        resolver: this.resolver(),
        interpreter: this.interpreter(),
      }
    );
  }

  protected defaults(): CoreOptions {
    return this._defaults;
  }
}
