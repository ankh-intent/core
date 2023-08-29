import { TranslationContext } from '@intent/translator';
import { ArrayLiteral } from '@alchemy/modules';
import { ArrayNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ArrayLiteralTranslatorChildren = {
    expression: ExpressionNode;
};

export class ArrayLiteralTranslator extends AlchemyNodeTranslator<ArrayLiteral, ArrayLiteralTranslatorChildren> {
    translate(node: ArrayNode, context: TranslationContext<any>): ArrayLiteral {
        return ArrayLiteral.create(node, context.parentNode, {
            items: node.items.map((item) => this.child.expression(item, context)),
        });
    }
}
