import { TranslationContext } from '@intent/translator';
import { FunctorBody } from '@alchemy/modules';
import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type FunctorBodyTranslatorChildren = {
    block: BlockNode;
};

export class FunctorBodyTranslator extends AlchemyNodeTranslator<FunctorBody, FunctorBodyTranslatorChildren> {
    translate(node: FunctorBodyNode, context: TranslationContext<any>): FunctorBody {
        return FunctorBody.create(node, context.parentNode, {
            body: this.child.block(node.block, context),
        });
    }
}
