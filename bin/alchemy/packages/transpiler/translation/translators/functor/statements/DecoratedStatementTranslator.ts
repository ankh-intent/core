import { DecoratedStatement } from '@alchemy/modules';
import { StatementNode, DecoratedStatementNode, ExpressionNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type DecoratedStatementTranslatorChildren = {
    statement: StatementNode;
    expression: ExpressionNode;
};

export class DecoratedStatementTranslator extends NodeTranslator<DecoratedStatement, DecoratedStatementTranslatorChildren> {
    translate(node: DecoratedStatementNode, context: TranslationContext<any>): DecoratedStatement {
        return DecoratedStatement.create(node, context.parent, {
            decorator: this.child.expression(node.decorator, context),
            item: this.child.statement(node.item, context),
        });
    }
}
