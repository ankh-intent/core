import { Scope } from './Scope';

export class SerializingScope<T extends object> extends Scope<T> {
    nest(): this {
        return Reflect.construct(this.constructor, [
            Object.fromEntries(
                Object
                    .entries(this.items)
                    .map(([name, scope]) => [name, scope.nest()]),
            ),
            this,
        ]);
    }
}
