import { TranslationContext } from '@intent/translator';
import { ExpressionStatement } from '@alchemy/modules';
import { ExpressionNode, ExpressionStatementNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type ExpressionStatementTranslatorChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementTranslator extends AlchemyNodeTranslator<ExpressionStatement, ExpressionStatementTranslatorChildren> {
    translate(node: ExpressionStatementNode, context: TranslationContext<any>): ExpressionStatement {
        return ExpressionStatement.create(node, context.parent, {
            expression: this.child.expression(node.expression, context),
        });
    }
}
