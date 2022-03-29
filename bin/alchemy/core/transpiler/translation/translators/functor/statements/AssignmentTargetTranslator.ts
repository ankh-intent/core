import { AssignmentTarget } from '../../../../../modules';
import { ExpressionNode, AssignmentTargetNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type AssignmentTargetTranslatorChildren = {
  expression: ExpressionNode;
};

export class AssignmentTargetTranslator extends NodeTranslator<AssignmentTarget<any>, AssignmentTargetTranslatorChildren> {
  translate(node: AssignmentTargetNode, c): AssignmentTarget<any> {
    return AssignmentTarget.create(node, c.parent, {
      _isDeclaration: node.isDeclaration(),
      target: this.child.expression(node.target, c),
    });
  }
}
