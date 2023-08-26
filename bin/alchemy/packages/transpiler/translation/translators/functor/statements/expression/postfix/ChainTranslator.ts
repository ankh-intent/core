import { Chain } from '@alchemy/modules';
import { ChainNode, IdentifierNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type ChainTranslatorChildren = {
    identifier: IdentifierNode;
};

export class ChainTranslator extends NodeTranslator<Chain, ChainTranslatorChildren> {
    translate(node: ChainNode, context: TranslationContext<any>): Chain {
        return Chain.create(node, context.parent, {
            right: this.child.identifier(node.right, context),
        });
    }
}
