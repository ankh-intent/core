import { IfStatementNode, BlockNode, StatementNode, AssignmentStatementNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IfStatementSerializerChildren {
  block: BlockNode;
  statement: StatementNode;
  expression: ExpressionNode;
}

export class IfStatementSerializer extends NodeSerializer<IfStatementNode, IfStatementSerializerChildren> {
  serialize(node: IfStatementNode): string {
    const ifTrue = this.child.block(node.ifTrue);
    const ifFalse = node.ifFalse && this.child.block(node.ifFalse);
    const body = ifTrue + (ifFalse ? ` else ${ifFalse}` : '');

    if (node.condition instanceof AssignmentStatementNode) {
      return `{${this.wrap([
        this.child.statement(node.condition) + ';',
        `\nif (${this.child.expression(node.condition.target.target)}) ${body}`,
      ])}}`;
    }

    return (
      `\nif (${this.child.statement(node.condition)}) ${body}\n`
    );
  }
}
