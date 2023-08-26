import { ArrayLiteral } from '../../../../../../../modules';
import { ArrayNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type ArrayLiteralTranslatorChildren = {
    expression: ExpressionNode;
};

export class ArrayLiteralTranslator extends NodeTranslator<ArrayLiteral, ArrayLiteralTranslatorChildren> {
    translate(node: ArrayNode, context: TranslationContext<any>): ArrayLiteral {
        return ArrayLiteral.create(node, context.parent, {
            items: node.items.map((item) => this.child.expression(item, context)),
        });
    }
}
