
import * as path from 'path';

import { AbstractConfigProvider } from './core/kernel/config/AbstractConfigProvider';
import { Core, CoreConfig, EmitConfig } from './Core';
import { UnitMatcher } from './core/consumers/watching/watchdog/matcher/UnitMatcher';
import { WatchdogConfig } from './core/consumers/watching/watchdog/Watchdog';
import { ResolverConfig } from './intent-core/chips/ResolverConfig';
import { InterpreterConfig } from './core/consumers/interpreting/DependencyModifiedConsumer';

export class CoreConfigProvider extends AbstractConfigProvider<CoreConfig> {
  private readonly _defaults: CoreConfig;

  public constructor(defaults: CoreConfig) {
    super();
    this._defaults = defaults;
  }

  protected usage(): string {
    const pckg = require("../../package.json");

    return `intent ${pckg.version}\n` +
      `${pckg.description}\n` +
      `Usage: intent [<options>] [<entry>]`
    ;
  }

  protected options(defaults: CoreConfig): any {
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
          "alias": "o",
          "describe": "Directory to output emitted files to",
          "default": defaults.resolver.paths.output,
          "requiresArg": true,
        },
      },
      "Emit options": {
        "output-emit-files": {
          "type": "boolean",
          "describe": "Emit files",
          "default": defaults.emit.files,
          "requiresArg": false,
        },
        "output-emit-stats": {
          "type": "boolean",
          "describe": "Emit compilation stat event to console output",
          "default": defaults.emit.stats,
          "requiresArg": false,
        },
        "output-emit-config": {
          "type": "boolean",
          "describe": "Emit to console the config, reconciled form command-line",
          "default": defaults.emit.config,
          "requiresArg": false,
        },
        "output-extension": {
          "type": "string",
          "describe": "Extension to emit files with",
          "default": defaults.emit.extension,
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

  protected emit(defaults: CoreConfig): EmitConfig {
    return {
      files: this.get("output-emit-files"),
      stats: this.get("output-emit-stats"),
      config: this.get("output-emit-config"),
      extension: this.get("output-extension"),
    };
  }

  protected files(defaults: CoreConfig): UnitMatcher[] {
    return this.get('entry').map((pattern) => ({
      event: 'change',
      pattern: eval(pattern),
    }));
  }

  protected watch(defaults: CoreConfig): WatchdogConfig {
    return this.get("watch") && {
        root: this.get("watch-root"),
        ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
        aggregation: this.get("watch-aggregation"),
      };
  }

  protected resolver(defaults: CoreConfig): ResolverConfig {
    return {
      paths: {
        project: path.resolve(this.get("work-dir")),
        output: path.resolve(this.get("output-dir")),
      },
    };
  }

  protected interpreter(defaults: CoreConfig): InterpreterConfig {
    return {
    };
  }

  public build(core: Core): CoreConfig {
    let defaults = this.defaults();

    return <CoreConfig> {
      emit: this.emit(defaults),
      files: this.files(defaults),
      resolver: this.resolver(defaults),
      interpreter: this.interpreter(defaults),
      watch: this.watch(defaults),
    };
  }

  protected defaults(): CoreConfig {
    return this._defaults;
  }
}
