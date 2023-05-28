import { LoopIterator } from '../../../../../modules';
import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type LoopIteratorTranslatorChildren = {
    expression: ExpressionNode;
    assignment_target: AssignmentTargetNode;
};

export class LoopIteratorTranslator extends NodeTranslator<LoopIterator, LoopIteratorTranslatorChildren> {
    translate(node: LoopIteratorNode, c): LoopIterator {
        return LoopIterator.create(node, c.parent, {
            target: this.child.assignment_target(node.target, c),
            expression: this.child.expression(node.expression, c),
        });
    }
}
