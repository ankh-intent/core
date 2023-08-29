import { Scope } from '@intent/kernel';

export class SerializingScope<T extends object> extends Scope<T> {
    // @ts-ignore
    nest(): this {
        return super.nest(
            Object.fromEntries(
                Object
                    .entries(this.items)
                    .map(([name, scope]) => [name, scope.nest()]),
            )
        ) as this;
    }
}
