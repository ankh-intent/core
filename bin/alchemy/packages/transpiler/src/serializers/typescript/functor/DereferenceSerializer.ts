import { SyntaxError } from '@intent/kernel';
import { ExpressionNode, DereferenceNode, ObjectSpreadNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type DereferenceSerializerChildren = {
    expression: ExpressionNode;
    object_spread: ObjectSpreadNode;
};

export class DereferenceSerializer extends NodeSerializer<DereferenceNode, DereferenceSerializerChildren> {
    serialize(node: DereferenceNode, context: SerializingContext): string {
        if (node.isSpread()) {
            return this.child.object_spread(node.spread, context);
        } else if (node.isIdentifier()) {
            const identifier = node.identifier;

            if (context.variables.get(identifier)) {
                throw new SyntaxError(
                    `Variable "${identifier}" already exists in the scope`,
                    node.node,
                    node.astRegion.positional,
                );
            }

            const local = context.variables.set(identifier, {
                local: identifier,
                type: context.anyType(node), // todo: how to infer an actual type?
            });

            return `${local.local}`;
        }

        throw new SyntaxError(
            `Dereference is neither an identifier, nor an object spread`,
            node.node,
            node.astRegion.positional,
        );
    }
}
