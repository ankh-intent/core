import { ExpressionStatement } from '../../../../../modules';
import { ExpressionNode, ExpressionStatementNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type ExpressionStatementTranslatorChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementTranslator extends NodeTranslator<ExpressionStatement, ExpressionStatementTranslatorChildren> {
    translate(node: ExpressionStatementNode, c): ExpressionStatement {
        return ExpressionStatement.create(node, c.parent, {
            expression: this.child.expression(node.expression, c),
        });
    }
}
