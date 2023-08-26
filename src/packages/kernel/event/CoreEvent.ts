import { CoreEvent } from '../interfaces';

export abstract class BaseCoreEvent<T = unknown> implements CoreEvent<T> {
    public readonly type: string;
    public readonly data: T;
    public parent: CoreEvent | null = null;
    public bubble: boolean;

    public constructor(data: T, parent: CoreEvent | null = null) {
        this.data = data;
        this.type = (<typeof BaseCoreEvent>this.constructor).type();
        this.parent = parent;
        this.bubble = true;
    }

    public stopPropagation(stop: boolean = true) {
        this.bubble = !stop;
    }

    public hasParent(event: CoreEvent): CoreEvent | null {
        let parent = this.parent;

        while (parent) {
            if (parent === event) {
                return this;
            }

            parent = parent.parent;
        }

        return null;
    }

    public is<K extends { new(...args: any[] ): any; type(): string }>(klass: K): this is InstanceType<K> {
        return this.type === klass.type();
    }

    public static type(): string {
        return this.name
            .replace(/Event$/, '')
            .toLowerCase();
    }
}
