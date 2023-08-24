export class Scope<T, N extends keyof T = keyof T> {
    protected readonly parentScope?: Scope<any>;
    public readonly data: Partial<T>;

    constructor(data: Partial<T>, parentScope?: Scope<any>) {
        this.parentScope = parentScope;
        this.data = data;
    }

    nest(data?: Partial<any>): Scope<any> {
        return Reflect.construct(this.constructor, [data || {}, this]);
    }

    get depth(): number {
        return 1 + (this.parentScope?.depth || 0);
    }

    set(name: N, value: T[N]) {
        this.data[name] = value;

        return value;
    }

    delete(name: N) {
        return delete this.data[name];
    }

    get(name: N): T[N] | undefined {
        return this.data[name] || this.parentScope?.get(name);
    }
}
