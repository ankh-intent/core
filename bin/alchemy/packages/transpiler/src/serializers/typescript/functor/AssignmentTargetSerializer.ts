import { ExpressionNode, AssignmentTargetNode, ReferenceNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type AssignmentTargetSerializerChildren = {
    expression: ExpressionNode;
    type: ReferenceNode;
};

export class AssignmentTargetSerializer extends NodeSerializer<AssignmentTargetNode, AssignmentTargetSerializerChildren> {
    serialize(node: AssignmentTargetNode, context: SerializingContext): string {
        const decl = node.isDeclaration() ? 'let ' : '';
        const expression = this.child.expression(node.target, context);
        const type = node.type ? `: ${this.child.type(node.type, context)}` : '';

        return `${decl}${expression}${type}`;
    }
}
