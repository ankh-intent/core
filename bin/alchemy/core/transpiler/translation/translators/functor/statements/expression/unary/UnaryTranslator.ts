import { Unary } from '../../../../../../../modules';
import { UnaryNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type UnaryTranslatorChildren = {
    expression: ExpressionNode;
};

export class UnaryTranslator extends NodeTranslator<Unary, UnaryTranslatorChildren> {
    translate(node: UnaryNode, context: TranslationContext<any>): Unary {
        return Unary.create(node, context.parent, {
            operation: node.operation,
            base: this.child.expression(node.base, context),
        });
    }
}
