import { ArrayNode, ExpressionNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';
import { TranslationContext } from '../../../../TranslationContext';

export type ArrayLiteralTranslatorChildren = {
  expression: ExpressionNode;
};

export class ArrayLiteralTranslator extends NodeTranslator<ArrayNode, ArrayLiteralTranslatorChildren> {
  translate(node: ArrayNode, context: TranslationContext): string {
    return `[${this.wrapInlineList(node.items.map((item) => this.child.expression(item, context)))}]`
  }
}
