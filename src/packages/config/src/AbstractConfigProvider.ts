import { resolve } from 'path';
import { usage } from 'yargs';
import { escapeRegExp } from 'lodash';

import { BubblingFinder } from '../../source';

type OptionDescriptor = {
    path?: boolean;
    default?: any;
    mapper?: (v: any, m: (v: any) => any) => any;
};

export abstract class AbstractConfigProvider<O, C> {
    private _argv: any;
    private readonly _defaults: Partial<O>;

    public constructor(defaults: Partial<O>) {
        this._defaults = defaults;
    }

    protected defaults(): Partial<O> {
        return this._defaults;
    }

    protected argv() {
        const map = this.options(
            this.defaults(),
        );
        const options = {};

        for (const group in map) {
            if (!map.hasOwnProperty(group)) {
                continue;
            }

            const cwd = resolve(process.cwd());
            const regexp = new RegExp(`^${escapeRegExp(cwd)}`);
            const entries: [string, OptionDescriptor][] = Object.entries(map[group]);
            const remapPath = (v: unknown) => String(v).replace(regexp, '.');

            for (const [name, { path, default: d, mapper, ...option }] of entries) {
                if (path || mapper) {
                    (option as any).default = mapper ? mapper(d, remapPath) : remapPath(d);
                } else {
                    (option as any).default = d;
                }

                options[name] = Object.assign(
                    { group: group + ':' },
                    option,
                );
            }
        }

        const built = usage(this.usage())
            .help('help')
            .version()
            .alias('help', 'h')
            .alias('version', 'v')
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

        return (
            `${data.name} ${data.version}\n` +
            `${data.description}\n` +
            `Usage: ${data.name} [<options>] [<entry>]`
        );
    }

    protected abstract options(def: Partial<O>): any;

    public abstract build(core: C): O;
}
