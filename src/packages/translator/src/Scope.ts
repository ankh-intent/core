import { ScopeInterface } from './interfaces';

export class Scope<C extends object, N extends keyof C = keyof C> implements ScopeInterface<C, N> {
    public readonly items: C;
    public readonly parent?: ScopeInterface<C, N>;
    protected _size: number;

    constructor(items?: C, parent?: ScopeInterface<C, N>) {
        this.items = items || ({} as C);
        this.parent = parent;
        this._size = Object.keys(this.items).length;
    }

    nest(): this {
        return Reflect.construct(this.constructor, [{}, this]);
    }

    get depth(): number {
        return 1 + (this.parent?.depth || 0);
    }

    get size() {
        return this._size;
    }

    set(name: N, value: C[N]): C[N] {
        if (!(name in this.items)) {
            this._size++;
        }

        this.items[name] = value;

        return value;
    }

    delete(name: N): boolean {
        const result = delete this.items[name];

        if (result) {
            this._size--;
        }

        return result;
    }

    get(name: N): C[N] | null {
        return (this.items[name] || this.parent?.get(name) || null) as C[N] | null;
    }
}
