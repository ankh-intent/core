import { SyntaxError } from '@intent/parser';
import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface LoopIteratorSerializerChildren {
  expression: ExpressionNode;
  assignment_target: AssignmentTargetNode;
}

export class LoopIteratorSerializer extends NodeSerializer<LoopIteratorNode, LoopIteratorSerializerChildren> {
  serialize(node: LoopIteratorNode, context): string {
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
        'of',
        this.child.expression(node.expression, context),
      ].join(' ')
    );
  }
}
