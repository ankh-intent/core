import { TranslationContext } from '@intent/translator';
import { DecoratedStatement } from '@alchemy/modules';
import { StatementNode, DecoratedStatementNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type DecoratedStatementTranslatorChildren = {
    statement: StatementNode;
    expression: ExpressionNode;
};

export class DecoratedStatementTranslator extends AlchemyNodeTranslator<DecoratedStatement, DecoratedStatementTranslatorChildren> {
    translate(node: DecoratedStatementNode, context: TranslationContext<any>): DecoratedStatement {
        return DecoratedStatement.create(node, context.parent, {
            decorator: this.child.expression(node.decorator, context),
            item: this.child.statement(node.item, context),
        });
    }
}
