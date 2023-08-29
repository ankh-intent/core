import { ScopeInterface } from './interfaces';

export class Scope<C extends object, N extends keyof C = keyof C> implements ScopeInterface<C, N> {
    public readonly items: C;
    public readonly parent?: ScopeInterface<C, N>;

    constructor(items?: C, parent?: ScopeInterface<C, N>) {
        this.items = items || ({} as C);
        this.parent = parent;
    }

    nest<S extends ScopeInterface<K, keyof K>, K extends object>(data?: Partial<K>): S {
        return Reflect.construct(this.constructor, [data || {}, this]);
    }

    get depth(): number {
        return 1 + (this.parent?.depth || 0);
    }

    get size() {
        return Object.keys(this.items).length;
    }

    set(name: N, value: C[N]): C[N] {
        this.items[name] = value;

        return value;
    }

    delete(name: N): boolean {
        return delete this.items[name];
    }

    get(name: N): C[N] | null {
        return (this.items[name] || this.parent?.get(name) || null) as C[N] | null;
    }
}
