import { TranslationContext } from '@intent/translator';
import { Callable } from '@alchemy/modules';
import { CallableNode, FunctorNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type CallableLiteralTranslatorChildren = {
    functor: FunctorNode;
};

export class CallableLiteralTranslator extends AlchemyNodeTranslator<Callable, CallableLiteralTranslatorChildren> {
    translate(node: CallableNode, context: TranslationContext<any>): Callable {
        return Callable.create(node, context.parent, {
            functor: this.child.functor(node.functor, context),
        });
    }
}
