export interface CoreEvent<T = unknown> {
    readonly type: string;
    readonly data: T;
    parent: CoreEvent | null;
    bubble: boolean;

    hasParent(event: CoreEvent): CoreEvent | null;
    stopPropagation(stop?: boolean): void;
    is<K extends { new(...args: any[] ): any; type(): string }>(klass: K): this is InstanceType<K>;
}

export type CoreStat<T, S> = S & {
    type: T;
}

export interface CoreStatProcessor<T, S> {
    process(event: CoreEvent<CoreStat<T, S>>, _data: S): CoreEvent<CoreStat<T, S>>;
}

export interface CoreEventConsumer<T, E extends CoreEvent<T>> {
    consume(event: E): CoreEvent | void;
}

export interface ScopeInterface<C extends object, N extends keyof C = keyof C> {
    readonly parent?: ScopeInterface<C, N>;
    readonly items: C;
    readonly depth: number;
    readonly size: number;

    nest<S extends ScopeInterface<K, keyof K>, K extends object>(data?: Partial<K>): S;
    set(name: N, value: C[N]): C[N];
    delete(name: N): boolean;
    get(name: N): C[N] | null;
}
