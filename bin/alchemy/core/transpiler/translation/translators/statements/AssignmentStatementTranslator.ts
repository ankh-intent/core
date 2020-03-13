import { SyntaxError } from '@intent/parser';
import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type AssignmentStatementTranslatorChildren = {
  assignment_target: AssignmentTargetNode;
  expression: ExpressionNode;
};

export class AssignmentStatementTranslator extends NodeTranslator<AssignmentStatementNode, AssignmentStatementTranslatorChildren> {
  translate(node: AssignmentStatementNode, context): string {
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
