
import * as path from 'path';

import { AbstractConfigProvider } from './kernel/config/AbstractConfigProvider';
import { Core, CoreConfig, EmitConfig, EntryConfig, PathsConfig } from './Core';
import { WatchdogConfig } from './kernel/watchdog/Watchdog';
import { Objects } from './utils/Objects';
import { Container } from './utils/Container';
import * as fs from 'fs';
import { Strings } from './utils/Strings';

export const regexpify = (r: RegExp|string) => {
  return (typeof r === 'string')
    ? r
    : String(r).replace('\\\\', '\\');
};

const isMergeable = (o: any) => {
  return Objects.is(o) && !((o instanceof Date) || (o instanceof RegExp));
};

export const merge = (...os) => {
  const target = {};

  for (const o of os) {
    for (const [key, value2] of Object.entries(o)) {
      const value1 = target[key];
      const o1 = isMergeable(value1);
      const o2 = isMergeable(value2);

      target[key] = (o1 && o2)
        ? merge(value1, value2)
        : value2
      ;
    }
  }

  return target;
};

const fileLookup = (name, dir) => {
  const file = path.join(dir, name);

  if (fs.existsSync(file)) {
    return file;
  }

  const parent = path.dirname(dir);

  return parent && fileLookup(name, parent);
};

export class ConfigProvider<T extends CoreConfig> extends AbstractConfigProvider<T> {
  private readonly _defaults: T;

  public constructor(defaults: T) {
    super();
    this._defaults = defaults;
  }

  protected usage(): string {
    const data = fileLookup('package.json', __dirname);

    if (!data) {
      throw new Error('Can\'t find "package.json" file');
    }

    const pckg = require(path.join(data));

    return `${pckg.name} ${pckg.version}\n` +
      `${pckg.description}\n` +
      `Usage: ${pckg.name} [<options>] [<entry>]`
    ;
  }

  protected entriesToStrings(entries: Container<EntryConfig>): string[] {
    // -e index=./src/{.int} -e tests=./tests/{.ts,.js}
    return Object.entries(entries)
      .map(([name, e]) => {
        const path = e.path.replace(/[\\/]$/, '');
        const patterns = e.test.map(({ pattern }) => pattern);

        return `${name}=${path}/{${patterns.join(',')}}`;
      })
    ;
  }

  protected stringsToEntries(strings: string[]): Container<EntryConfig> {
    if (!strings.length) {
      return null;
    }

    const config = {};

    for (const string of strings) {
      const [, name, pattern] = string.match(/^([^=]+)=(.*)$/) || [null, null, null];

      if (name) {
        const [, path, patterns] = pattern.match(/^(.*)\{(.*)\}$/) || [null, null, null];

        if (path) {
          const test = patterns
            .split(',')
            .filter(Boolean)
            .map(test => ({
              event: 'change',
              pattern: new RegExp(`${Strings.escapeRegExp(test)}$`),
            }))
          ;

          if (test.length) {
            config[name] = { path, test };
          } else {
            throw new Error(`Can't parse entry test pattern configuration: "${patterns}"`);
          }
        } else {
          throw new Error(`Can't parse entry path configuration: "${pattern}"`);
        }
      } else {
        throw new Error(`Can't parse entry configuration: "${string}"`);
      }
    }

    return config;
  }

  protected options(defaults: T): any {
    return {
      "Basic options": {
        "entry": {
          "type": "array",
          "alias": "e",
          "describe": "Patterns to capture entry files to process",
          "default": this.entriesToStrings(defaults.entry),
          "requiresArg": true,
        },
        "work-dir": {
          "type": "string",
          "alias": "d",
          "describe": "Working directory to resolve as root for namespaces",
          "default": defaults.paths.project || process.cwd(),
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
          "default": regexpify(defaults.watch.ignore),
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

  private paths(): PathsConfig {
    return <PathsConfig>{
      project: path.resolve(this.get("work-dir")),
    };
  }

  private entry() {
    return this.stringsToEntries(this.get("entry"));
  }

  protected emit(): EmitConfig {
    return {
      files: this.get("output-emit-files"),
      stats: this.get("output-emit-stats"),
      config: this.get("output-emit-config"),
    };
  }

  protected watch(): WatchdogConfig {
    return this.get("watch") && {
      root: this.get("watch-root"),
      ignore: new RegExp(this.get("watch-ignore").replace('\\', '\\\\')),
      aggregation: this.get("watch-aggregation"),
    };
  }

  public build(core: Core<T>): T {
    return <T> {
      paths: this.paths(),
      entry: this.entry(),
      emit: this.emit(),
      watch: this.watch(),
    };
  }

  protected defaults(): T {
    return this._defaults;
  }
}
