import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type LoopIteratorSerializerChildren = {
    expression: ExpressionNode;
    assignment_target: AssignmentTargetNode;
};

export class LoopIteratorSerializer extends NodeSerializer<LoopIteratorNode, LoopIteratorSerializerChildren> {
    serialize(node: LoopIteratorNode, context: SerializingContext): string {
        return (
            [
                this.child.assignment_target(node.target, context),
                'of',
                this.child.expression(node.expression, context),
            ].join(' ')
        );
    }
}
