import { TranslationContext } from '@intent/translator';
import { AbstractNode } from '@intent/kernel';
import { Expression } from '@alchemy/modules';

import { ExpressionNode, OperationNode, UnaryNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';

export type ExpressionTranslatorChildren = {
    expression: ExpressionNode;
    literal: AbstractNode;
    operation: OperationNode;
    unary: UnaryNode;
};

export class ExpressionTranslator extends AlchemyNodeTranslator<Expression, ExpressionTranslatorChildren> {
    translate(node: ExpressionNode, context: TranslationContext<any>): Expression {
        if (node instanceof UnaryNode) {
            return this.child.unary(node, context);
        }

        const base = (
            (node.base instanceof ExpressionNode)
                ? this.child.expression(node.base, context)
                : this.child.literal(node.base, context)
        );

        return Expression.create(node, context.parentNode, {
            base,
            operations: node.operations.map((operation) => this.child.operation(operation, context)),
        });
    }
}
