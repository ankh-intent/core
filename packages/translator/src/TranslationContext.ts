import { TreeNode, Scope } from '@intent/kernel';
import { TranslatedConstructor, TranslatedFactory } from './interfaces';
import { Translated } from './Translated';

interface SerializingScopeInterface<P> {
    parent: P;
}

interface Spawn<T extends Translated<any>> {
    node: T;
    context: TranslationContext<T>;
}

export class TranslationContext<P extends Translated<any> | undefined> extends Scope<SerializingScopeInterface<P>> {
    spawn<N extends TreeNode, I extends Translated<N>>(klass: TranslatedConstructor<I>, node: N, factory?: TranslatedFactory<I>): Spawn<I> {
        const spawned = klass.create(node, this.parentNode, factory);

        return {
            node: spawned,
            context: this.nest({
                parent: spawned,
            }),
        };
    }

    get parentNode(): P {
        return this.get('parent')!;
    }
}
