import { TranslationContext } from '@intent/translator';
import { CastNode, FunctorNode, ReferenceNode } from '@alchemy/ast';
import { Cast } from '@alchemy/modules';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type CastTranslatorChildren = {
    reference: ReferenceNode;
    functor: FunctorNode;
};

export class CastTranslator extends AlchemyNodeTranslator<Cast, CastTranslatorChildren> {
    translate(node: CastNode, context: TranslationContext<any>): Cast {
        return Cast.create(node, context.parentNode, {
            type: this.child.reference(node.type, context),
            functor: node.functor && this.child.functor(node.functor, context),
        });
    }
}
