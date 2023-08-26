import { Callable } from '@alchemy/modules';
import { CallableNode, FunctorNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type CallableLiteralTranslatorChildren = {
    functor: FunctorNode;
};

export class CallableLiteralTranslator extends NodeTranslator<Callable, CallableLiteralTranslatorChildren> {
    translate(node: CallableNode, context: TranslationContext<any>): Callable {
        return Callable.create(node, context.parent, {
            functor: this.child.functor(node.functor, context),
        });
    }
}
