import { ReturnStatement } from '../../../../../modules';
import { ReturnStatementNode, ExpressionNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type ReturnStatementTranslatorChildren = {
  expression: ExpressionNode;
};

export class ReturnStatementTranslator extends NodeTranslator<ReturnStatement, ReturnStatementTranslatorChildren> {
  translate(node: ReturnStatementNode, c): ReturnStatement {
    return ReturnStatement.create(node, c.parent, {
      expression: node.expression && this.child.expression(node.expression, c),
    });
  }
}
