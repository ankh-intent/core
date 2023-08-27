import { resolve } from 'path';

import { Container, Strings } from '@intent/utils';
import { BubblingFinder } from '@intent/source';

type OptionDescriptor = {
    path?: boolean;
    default?: any;
    mapper?: (v: any, m: (v: any) => any) => any;
};

export abstract class AbstractConfigProvider<O, Option extends { group?: string }> {
    private _argv: any;
    private readonly _defaults: Partial<O>;

    public constructor(defaults: Partial<O>) {
        this._defaults = defaults;
    }

    protected defaults(): Partial<O> {
        return this._defaults;
    }

    protected argv(): O {
        const map = this.options(
            this.defaults(),
        );
        const options: Container<Option> = {};
        const cwd = resolve(process.cwd());
        const regexp = new RegExp(`^${Strings.escapeRegExp(cwd)}`);
        const remapPath = (v: unknown) => String(v).replace(regexp, '.');

        for (const group in map) {
            if (!map.hasOwnProperty(group)) {
                continue;
            }

            const entries: [string, OptionDescriptor][] = Object.entries(map[group]);

            for (const [name, { path, default: d, mapper, ...option }] of entries) {
                if (path || mapper) {
                    (option as any).default = mapper ? mapper(d, remapPath) : remapPath(d);
                } else {
                    (option as any).default = d;
                }

                options[name] = <Option>Object.assign(
                    { group: group + ':' },
                    option,
                );
            }
        }

        return this.compile(options);
    }

    protected abstract compile(options: Container<Option>): O;

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

    public abstract build(): O;
}
