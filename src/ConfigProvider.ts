import * as path from 'path';

import { Container, Strings } from '@intent/utils';
import { AbstractConfigProvider } from '@intent/config';

import { Core } from './Core';

import { CoreConfig, EmitConfig, EntryConfig, InterpreterConfig, OutputConfig, PathsConfig } from './CoreConfig';

export class ConfigProvider<T extends CoreConfig> extends AbstractConfigProvider<T, Core<T, any, any>> {
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
      return {};
    }

    const config = {};

    for (const string of strings) {
      const [, name, pattern] = string.match(/^([^=]+)=(.*)$/) || [null, null, null];

      if (name && pattern) {
        const [, path, patterns] = pattern.match(/^(.*){(.*)}$/) || [null, null, null];

        if (path && patterns) {
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

  protected options(defaults: Partial<T>): any {
    return {
      "Basic options": {
        "entry": {
          "type": "array",
          "alias": "e",
          "describe": "Patterns to capture entry files to process",
          "default": this.entriesToStrings(defaults.entry!),
          "requiresArg": true,
        },
        "work-dir": {
          "type": "string",
          "alias": "d",
          "describe": "Working directory to resolve as root for namespaces",
          "default": defaults.paths!.project || process.cwd(),
          "requiresArg": true,
        },
        "lib-dir": {
          "type": "string",
          "alias": "l",
          "describe": "Directory to resolve as root for internal libraries",
          "default": defaults.paths!.internal || process.cwd(),
          "requiresArg": true,
        },
      },
      "Emit options": {
        "output-emit-files": {
          "type": "boolean",
          "describe": "Emit files",
          "default": defaults.emit!.files,
          "requiresArg": false,
        },
        "output-emit-stats": {
          "type": "boolean",
          "describe": "Emit compilation stat event to console output",
          "default": defaults.emit!.stats,
          "requiresArg": false,
        },
        "output-emit-config": {
          "type": "boolean",
          "describe": "Emit to console the config, reconciled form command-line",
          "default": defaults.emit!.config,
          "requiresArg": false,
        },
        "output-dir": {
          "type": "string",
          "alias": "o",
          "describe": "Directory to output emitted files to",
          "default": defaults.output!.path,
          "requiresArg": true,
        },
        "output-extension": {
          "type": "string",
          "describe": "Extension to emit files with",
          "default": defaults.output!.extension,
          "requiresArg": true,
        },
        "verbose": {
          "type": "boolean",
          "describe": "Print native errors stack in stack-traces",
          "default": defaults.emit!.verbose,
          "requiresArg": false,
        },
      },
    };
  }

  private paths(): PathsConfig {
    return <PathsConfig>{
      project: path.resolve(this.get("work-dir")),
      internal: path.resolve(this.get("lib-dir")),
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
      verbose: this.get("verbose"),
    };
  }

  private output(): OutputConfig {
    return <OutputConfig> {
      extension: this.get("output-extension"),
      path: path.resolve(this.get("output-dir")),
    };
  }

  protected interpreter(): InterpreterConfig {
    return {
    };
  }

  public build(core) {
    return <T> {
      paths: this.paths(),
      entry: this.entry(),
      emit: this.emit(),
      output: this.output(),
      interpreter: this.interpreter(),
    };
  }
}
