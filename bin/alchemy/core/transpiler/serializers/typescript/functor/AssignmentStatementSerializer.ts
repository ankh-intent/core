import { ExpressionNode, AssignmentStatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface AssignmentStatementSerializerChildren {
  expression: ExpressionNode;
}

export class AssignmentStatementSerializer extends NodeSerializer<AssignmentStatementNode, AssignmentStatementSerializerChildren> {
  serialize(node: AssignmentStatementNode, context): string {
    return (
      (node.operator === '=' ? 'let ' : '') +
        [
          this.child.expression(node.target.target, context),
          node.operator,
          this.child.expression(node.expression, context),
        ].join(' ')
    );
  }
}
