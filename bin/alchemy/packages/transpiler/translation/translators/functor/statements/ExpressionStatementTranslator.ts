import { ExpressionStatement } from '@alchemy/modules';
import { ExpressionNode, ExpressionStatementNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type ExpressionStatementTranslatorChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementTranslator extends NodeTranslator<ExpressionStatement, ExpressionStatementTranslatorChildren> {
    translate(node: ExpressionStatementNode, context: TranslationContext<any>): ExpressionStatement {
        return ExpressionStatement.create(node, context.parent, {
            expression: this.child.expression(node.expression, context),
        });
    }
}
