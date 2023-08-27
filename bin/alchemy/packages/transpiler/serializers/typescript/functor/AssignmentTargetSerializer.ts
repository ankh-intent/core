import { ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type AssignmentTargetSerializerChildren = {
    expression: ExpressionNode;
};

export class AssignmentTargetSerializer extends NodeSerializer<AssignmentTargetNode, AssignmentTargetSerializerChildren> {
    serialize(node: AssignmentTargetNode, context: SerializingContext): string {
        if (node.isDeclaration()) {
            return `let ${node.target.base.name}`;
        }

        return this.child.expression(node.target, context);
    }
}
