import { TranslationContext } from '@intent/translator';
import { ReturnStatement } from '@alchemy/modules';
import { ReturnStatementNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type ReturnStatementTranslatorChildren = {
    expression: ExpressionNode;
};

export class ReturnStatementTranslator extends AlchemyNodeTranslator<ReturnStatement, ReturnStatementTranslatorChildren> {
    translate(node: ReturnStatementNode, context: TranslationContext<any>): ReturnStatement {
        return ReturnStatement.create(node, context.parent, {
            expression: node.expression && this.child.expression(node.expression, context),
        });
    }
}
