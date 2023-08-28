import { TranslationContext } from '@intent/translator';
import { Unary } from '@alchemy/modules';
import { UnaryNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type UnaryTranslatorChildren = {
    expression: ExpressionNode;
};

export class UnaryTranslator extends AlchemyNodeTranslator<Unary, UnaryTranslatorChildren> {
    translate(node: UnaryNode, context: TranslationContext<any>): Unary {
        return Unary.create(node, context.parentNode, {
            operators: node.operators,
            pre: node.pre,
            base: this.child.expression(node.base, context),
            post: node.post,
        });
    }
}
