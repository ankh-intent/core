import yargs, { usage } from 'yargs';
import { resolve } from 'node:path';

import { Container, Strings } from '@intent/utils';
import { CoreConfig, EntryConfig, PathsConfig, EmitConfig, OutputConfig, InterpreterConfig } from './CoreConfig';
import { AbstractConfigProvider } from './AbstractConfigProvider';

export class ConfigProvider<T extends CoreConfig> extends AbstractConfigProvider<T, yargs.Options> {
    protected compile(options: Container<yargs.Options>): T {
        let built = usage(this.usage())
            .help('help')
            .version()
            .alias('help', 'h')
            .alias('version', 'v')
            .options(options)
        ;

        if (this.strict()) {
            built = built.strict();
        }

        return built.argv as unknown as T;
    }

    protected entriesToStrings(entries: Container<EntryConfig>): string[] {
        // -e index=./src/{.int} -e tests=./tests/{.ts,.js}
        return Object.entries(entries).map(([name, e]) => {
            const path = e.path.replace(/[\\/]$/, '');
            const patterns = e.test.map(({ pattern }) => pattern);

            return `${name}=${path}/{${patterns.join(',')}}`;
        });
    }

    protected entriesToConfigDefault(entries: string[], mapper: (v: any) => any) {
        return entries.map((entry) => {
            const [, name, path] = entry.match(/^([^=]+)=(.*)$/) || [null, null, null];

            return `${name}=${mapper(path)}`;
        });
    }

    protected stringsToEntries(strings: string[]): Container<EntryConfig> {
        if (!strings.length) {
            return {};
        }

        const config: Container<EntryConfig> = {};

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
            'Basic options': {
                'entry': {
                    'type': 'array',
                    'alias': 'e',
                    'describe': 'Patterns to capture entry files to process',
                    'default': this.entriesToStrings(defaults.entry!),
                    'mapper': this.entriesToConfigDefault,
                    'requiresArg': true,
                },
                'work-dir': {
                    'type': 'string',
                    'alias': 'd',
                    'describe': 'Working directory to resolve as root for namespaces',
                    'default': defaults.paths!.project || process.cwd(),
                    'path': true,
                    'requiresArg': true,
                },
                'lib-dir': {
                    'type': 'string',
                    'alias': 'l',
                    'describe': 'Directory to resolve as root for internal libraries',
                    'default': defaults.paths!.internal || process.cwd(),
                    'path': true,
                    'requiresArg': true,
                },
                'lib-name': {
                    'type': 'string',
                    'alias': 'n',
                    'describe': 'Internal libraries root identifier',
                    'default': defaults.paths!.internalName,
                    'requiresArg': true,
                },
            },
            'Emit options': {
                'output-emit-files': {
                    'type': 'boolean',
                    'describe': 'Emit files',
                    'default': defaults.emit!.files,
                    'requiresArg': false,
                },
                'output-emit-stats': {
                    'type': 'boolean',
                    'describe': 'Emit compilation stat event to console output',
                    'default': defaults.emit!.stats,
                    'requiresArg': false,
                },
                'output-emit-config': {
                    'type': 'boolean',
                    'describe': 'Emit to console the config, reconciled form command-line',
                    'default': defaults.emit!.config,
                    'requiresArg': false,
                },
                'output-dir': {
                    'type': 'string',
                    'alias': 'o',
                    'describe': 'Directory to output emitted files to',
                    'default': defaults.output!.path,
                    'path': true,
                    'requiresArg': true,
                },
                'output-extension': {
                    'type': 'string',
                    'describe': 'Extension to emit files with',
                    'default': defaults.output!.extension,
                    'requiresArg': true,
                },
                'verbosity': {
                    'type': 'number',
                    'describe': 'Logging level (' + [
                        '1 - silent',
                        '2 - error-only',
                        '3 - sparse',
                        '4 - normal',
                        '5 - with native error stacks in stack-traces',
                        '6 - with traces'].join(', ') +
                        ')',
                    'default': defaults.emit!.verbosity,
                    'requiresArg': true,
                },
            },
        };
    }

    private paths(): PathsConfig {
        return {
            project: resolve(this.get('work-dir')),
            internal: resolve(this.get('lib-dir')),
            internalName: this.get('lib-name'),
        };
    }

    private entry() {
        return this.stringsToEntries(this.get('entry'));
    }

    protected emit(): EmitConfig {
        return {
            files: this.get('output-emit-files'),
            stats: this.get('output-emit-stats'),
            config: this.get('output-emit-config'),
            verbosity: this.get('verbose'),
        };
    }

    private output(): OutputConfig {
        return {
            extension: this.get('output-extension'),
            path: resolve(this.get('output-dir')),
        };
    }

    protected interpreter(): InterpreterConfig {
        return {};
    }

    public build() {
        return <T>{
            paths: this.paths(),
            entry: this.entry(),
            emit: this.emit(),
            output: this.output(),
            interpreter: this.interpreter(),
        };
    }
}
