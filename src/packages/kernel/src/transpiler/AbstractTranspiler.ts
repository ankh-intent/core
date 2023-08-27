import { Strings, Container } from '@intent/utils';
import { Compiler, TemplateInterface } from '@intent/template';

export interface TranspilerInterface<S> {
    transpile(data: S): string[];
    keyed(data: any): string[];
}

export abstract class AbstractTranspiler<S> implements TranspilerInterface<S> {
    private _template: TemplateInterface<S, string[]>;
    protected readonly compiler: Compiler<any, string[]>;
    protected readonly visitors: Container<TranspilerInterface<any>> = {};

    public constructor(compiler: Compiler<any, string[]>) {
        this.compiler = compiler;
    }

    protected abstract get code(): string;

    protected get template(): TemplateInterface<S, string[]> {
        if (!this._template) {
            this._template = this.compiler.compile(
                this.code,
                (data: S, key: string) => {
                    const [property, modifier, filters] = this.modifiers(key);
                    const transpiler = this.visitors[property];
                    let resolved = data && this.resolve(data, property);

                    if (!(transpiler && resolved !== undefined)) {
                        return resolved !== undefined ? resolved : null;
                    }

                    if (modifier) {
                        if (modifier.indexOf('*') < 0) {
                            resolved = transpiler.transpile(resolved);
                        } else {
                            resolved = resolved ? transpiler.keyed(resolved) : [];
                        }
                    } else {
                        resolved = transpiler.transpile(resolved);
                    }

                    if (filters) {
                        resolved = eval('resolved' + filters);
                    }

                    return resolved;
                },
            );
        }

        return this._template;
    }

    public transpile(data: S): string[] {
        return this.template.apply(data);
    }

    public keyed(data: any): string[] {
        return Strings.fold(
            Object.values(data)
                .map((element: any) => this.transpile(element)),
        );
    }

    protected resolve(data: any, key: string): any {
        return (data && data.hasOwnProperty(key))
            ? data[key]
            : null;
    }

    protected modifiers(key: string): [string, string | null, string | null] {
        let m = key.match(/^([+\-*.=?]+)/);
        let modifiers: string | null = null;
        let filters: string | null = null;

        if (m) {
            modifiers = m[1];
            key = key.slice(modifiers.length);
        }

        m = key.match(/\|(.*)$/);

        if (m) {
            filters = m[1];
            key = key.slice(0, filters.length - 1);
        }

        return [key, modifiers, filters];
    }
}
