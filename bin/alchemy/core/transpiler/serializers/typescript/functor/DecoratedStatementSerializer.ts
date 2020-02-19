import {
  StatementNode,
  IfStatementNode,
  LoopStatementNode,
  BreakStatementNode,
  ReturnStatementNode, AssignmentStatementNode, ExpressionStatementNode, DecoratedStatementNode, ExpressionNode,
} from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface DecoratedStatementSerializerChildren {
  statement: StatementNode;
  expression: ExpressionNode;
}

export class DecoratedStatementSerializer extends NodeSerializer<DecoratedStatementNode, DecoratedStatementSerializerChildren> {
  serialize(node: DecoratedStatementNode): string {
    return this.wrapStatements([
      `@${this.child.expression(node.decorator)}`,
      this.child.statement(node.item),
    ]);
  }
}
