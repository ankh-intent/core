import { ExpressionNode, AssignmentStatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface AssignmentStatementSerializerChildren {
  expression: ExpressionNode;
}

export class AssignmentStatementSerializer extends NodeSerializer<AssignmentStatementNode, AssignmentStatementSerializerChildren> {
  serialize(node: AssignmentStatementNode): string {
    return `let ${this.child.expression(node.target.target)} ${node.operator} ${this.child.expression(node.expression)}`;
  }
}
