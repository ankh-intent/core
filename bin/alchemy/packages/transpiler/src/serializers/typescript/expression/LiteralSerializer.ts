import { AbstractNode } from '@intent/kernel';
import { PrimitiveNode, ObjectNode, ArrayNode, CallableNode, IdentifierNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type LiteralSerializerChildren = {
    primitive: PrimitiveNode;
    object_literal: ObjectNode;
    array_literal: ArrayNode;
    callable: CallableNode;
    identifier: IdentifierNode;
};

export class LiteralSerializer extends NodeSerializer<AbstractNode, LiteralSerializerChildren> {
    serialize(node: AbstractNode, context: SerializingContext): string {
        if (node instanceof PrimitiveNode) {
            return this.child.primitive(node, context);
        } else if (node instanceof ObjectNode) {
            return this.child.object_literal(node, context);
        } else if (node instanceof ArrayNode) {
            return this.child.array_literal(node, context);
        } else if (node instanceof CallableNode) {
            return this.child.callable(node, context);
        } else if (node instanceof IdentifierNode) {
            return this.child.identifier(node, context);
        }

        return `/* unknown literal "${node.node}" */ ${node.astRegion.extract()}`;
    }
}
