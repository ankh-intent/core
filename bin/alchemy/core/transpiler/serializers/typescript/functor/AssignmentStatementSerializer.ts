import { SyntaxError } from '@intent/parser';
import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type AssignmentStatementSerializerChildren = {
  assignment_target: AssignmentTargetNode;
  expression: ExpressionNode;
};

export class AssignmentStatementSerializer extends NodeSerializer<AssignmentStatementNode, AssignmentStatementSerializerChildren> {
  serialize(node: AssignmentStatementNode, context): string {
    if (node.isDeclaration()) {
      const identifier = node.targetBase.name;

      if (context.variables.get(identifier)) {
        throw new SyntaxError(
          `Variable "${identifier}" already exists in the scope`,
          node.node,
          node.astRegion.source,
          node.astRegion.position
        );
      }

      context.variables.set(identifier, {
        local: identifier,
        type: context.inferType(node.expression),
      });
    }

    return (
      [
        this.child.assignment_target(node.target, context),
        node.operator,
        this.child.expression(node.expression, context),
      ].join(' ')
    );
  }
}
