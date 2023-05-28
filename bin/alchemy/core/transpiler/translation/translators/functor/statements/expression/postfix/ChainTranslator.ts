import { Chain } from '../../../../../../../modules';
import { ChainNode, IdentifierNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type ChainTranslatorChildren = {
    identifier: IdentifierNode;
};

export class ChainTranslator extends NodeTranslator<Chain, ChainTranslatorChildren> {
    translate(node: ChainNode, c): Chain {
        return Chain.create(node, c.parent, {
            right: this.child.identifier(node.right, c),
        });
    }
}
