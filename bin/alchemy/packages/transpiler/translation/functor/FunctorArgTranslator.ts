import { TranslationContext } from '@intent/translator';
import { FunctorArg } from '@alchemy/modules';
import { FunctorArgNode, ReferenceNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type FunctorArgTranslatorChildren = {
    reference: ReferenceNode;
};

export class FunctorArgTranslator extends AlchemyNodeTranslator<FunctorArg, FunctorArgTranslatorChildren> {
    translate(node: FunctorArgNode, context: TranslationContext<any>): FunctorArg {
        return FunctorArg.create(node, context.parent, {
            name: node.name,
            type: this.child.reference(node.type, context),
        });
    }
}
