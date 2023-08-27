import { TranslationContext } from '@intent/translator';
import { Chain } from '@alchemy/modules';
import { ChainNode, IdentifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ChainTranslatorChildren = {
    identifier: IdentifierNode;
};

export class ChainTranslator extends AlchemyNodeTranslator<Chain, ChainTranslatorChildren> {
    translate(node: ChainNode, context: TranslationContext<any>): Chain {
        return Chain.create(node, context.parent, {
            right: this.child.identifier(node.right, context),
        });
    }
}
