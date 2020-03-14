import { DecoratedStatement } from '../../../../../modules';
import { StatementNode, DecoratedStatementNode, ExpressionNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type DecoratedStatementTranslatorChildren = {
  statement: StatementNode;
  expression: ExpressionNode;
};

export class DecoratedStatementTranslator extends NodeTranslator<DecoratedStatement, DecoratedStatementTranslatorChildren> {
  translate(node: DecoratedStatementNode, c): DecoratedStatement {
    return DecoratedStatement.create(node, c.parent, {
      decorator: this.child.expression(node.decorator, c),
      item: this.child.statement(node.item, c),
    });
  }
}
