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
