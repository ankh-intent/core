import { ExpressionNode, AssignmentTargetNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type AssignmentTargetSerializerChildren = {
  expression: ExpressionNode;
};

export class AssignmentTargetSerializer extends NodeSerializer<AssignmentTargetNode, AssignmentTargetSerializerChildren> {
  serialize(node: AssignmentTargetNode, context): string {
    if (node.isDeclaration()) {
      return `let ${node.target.base.name}`;
    }

    return this.child.expression(node.target, context);
  }
}