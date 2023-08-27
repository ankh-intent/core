import { TranslationContext } from '@intent/translator';
import { Functor } from '@alchemy/modules';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode, ReferenceNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type FunctorTranslatorChildren = {
    reference: ReferenceNode;
    functor_args: FunctorArgsNode;
    functor_body: FunctorBodyNode;
};

export class FunctorTranslator extends AlchemyNodeTranslator<Functor, FunctorTranslatorChildren> {
    translate(node: FunctorNode, context: TranslationContext<any>): Functor {
        return Functor.create(node, context.parent, {
            args: this.child.functor_args(node.args, context),
            returns: node.returns && this.child.reference(node.returns, context),
            body: this.child.functor_body(node.body, context),
        });
    }
}
