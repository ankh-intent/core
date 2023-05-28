import { Indexed } from '../../../../../../../modules';
import { IndexedNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type IndexedTranslatorChildren = {
    expression: ExpressionNode;
};

export class IndexedTranslator extends NodeTranslator<Indexed, IndexedTranslatorChildren> {
    translate(node: IndexedNode, c): Indexed {
        return Indexed.create(node, c.parent, {
            right: this.child.expression(node.right, c),
        });
    }
}
