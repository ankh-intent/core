import { SyntaxError } from '@intent/kernel';
import { ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ObjectSpreadItemSerializerChildren = {
    object_spread: ObjectSpreadNode;
    object_spread_item: ObjectSpreadItemNode<ObjectSpreadNode>;
};

export class ObjectSpreadItemSerializer extends NodeSerializer<ObjectSpreadItemNode<ObjectSpreadNode>, ObjectSpreadItemSerializerChildren> {
    serialize(node: ObjectSpreadItemNode<ObjectSpreadNode>, context: SerializingContext): string {
        const identifier = node.identifier;

        if (node.isSpread()) {
            return `${identifier}: ${this.child.object_spread(node.spread, context)}`;
        }

        if (context.variables.get(identifier)) {
            throw new SyntaxError(
                `Variable "${identifier}" already exists in the scope`,
                node.node,
                node.astRegion.positional,
            );
        }

        const variable = context.variables.set(identifier, {
            local: identifier,
            type: context.anyType(node),
        });

        return `${node.isRest ? '...' : ''}${variable.local}`;
    }
}
