import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type AssignmentStatementSerializerChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

export class AssignmentStatementSerializer extends NodeSerializer<AssignmentStatementNode, AssignmentStatementSerializerChildren> {
    serialize(node: AssignmentStatementNode, context: SerializingContext): string {
        return (
            [
                this.child.assignment_target(node.target, context),
                node.operator,
                this.child.expression(node.expression, context),
            ].join(' ')
        );
    }
}
