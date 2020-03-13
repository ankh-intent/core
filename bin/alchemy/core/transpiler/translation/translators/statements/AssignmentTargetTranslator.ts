import { ExpressionNode, AssignmentTargetNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type AssignmentTargetTranslatorChildren = {
  expression: ExpressionNode;
};

export class AssignmentTargetTranslator extends NodeTranslator<AssignmentTargetNode, AssignmentTargetTranslatorChildren> {
  translate(node: AssignmentTargetNode, context): string {
    if (node.isDeclaration()) {
      return `let ${node.target.base.name}`;
    }

    return this.child.expression(node.target, context);
  }
}
