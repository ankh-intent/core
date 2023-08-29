import { SyntaxError } from '@intent/kernel';
import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type LoopIteratorSerializerChildren = {
    expression: ExpressionNode;
    assignment_target: AssignmentTargetNode;
};

export class LoopIteratorSerializer extends NodeSerializer<LoopIteratorNode, LoopIteratorSerializerChildren> {
    serialize(node: LoopIteratorNode, context: SerializingContext): string {
        if (node.isDeclaration()) {
            const identifier = node.targetBase.name;

            if (context.variables.get(identifier)) {
                throw new SyntaxError(
                    `Variable "${identifier}" already exists in the scope`,
                    node.node,
                    node.astRegion.source,
                    node.astRegion.position,
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