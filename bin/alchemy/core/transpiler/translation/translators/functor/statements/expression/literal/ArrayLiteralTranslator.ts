import { ArrayLiteral } from '../../../../../../../modules';
import { ArrayNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type ArrayLiteralTranslatorChildren = {
    expression: ExpressionNode;
};

export class ArrayLiteralTranslator extends NodeTranslator<ArrayLiteral, ArrayLiteralTranslatorChildren> {
    translate(node: ArrayNode, c): ArrayLiteral {
        return ArrayLiteral.create(node, c.parent, {
            items: node.items.map((item) => this.child.expression(item, c)),
        });
    }
}
