import { TreeNode } from '@intent/kernel';
import { Scope } from '@intent/plugins';
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
    nest<C extends Translated<any>>(data?: Partial<SerializingScopeInterface<C>>): TranslationContext<C> {
        return <TranslationContext<C>>super.nest(data);
    }

    spawn<N extends TreeNode, I extends Translated<N>>(klass: TranslatedConstructor<I>, node: N, factory?: TranslatedFactory<I>): Spawn<I> {
        const spawned = klass.create(node, this.parent, factory);

        return {
            node: spawned,
            context: this.nest({
                parent: spawned,
            }),
        };
    }

    get parent(): P {
        return this.get('parent')!;
    }
}
