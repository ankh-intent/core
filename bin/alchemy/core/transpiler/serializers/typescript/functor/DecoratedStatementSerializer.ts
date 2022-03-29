import { StatementNode, DecoratedStatementNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type DecoratedStatementSerializerChildren = {
  statement: StatementNode;
  expression: ExpressionNode;
};

export class DecoratedStatementSerializer extends NodeSerializer<DecoratedStatementNode, DecoratedStatementSerializerChildren> {
  serialize(node: DecoratedStatementNode, context): string {
    return this.wrapStatements([
      `@${this.child.expression(node.decorator, context)}`,
      this.child.statement(node.item, context),
    ]);
  }
}
