import { FunctorBody } from '@alchemy/modules';
import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type FunctorBodyTranslatorChildren = {
    block: BlockNode;
};

export class FunctorBodyTranslator extends NodeTranslator<FunctorBody, FunctorBodyTranslatorChildren> {
    translate(node: FunctorBodyNode, context: TranslationContext<any>): FunctorBody {
        return FunctorBody.create(node, context.parent, {
            body: this.child.block(node.block, context),
        });
    }
}
