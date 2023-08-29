import { ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ObjectSpreadSerializerChildren = {
    object_spread_item: ObjectSpreadItemNode<ObjectSpreadNode>;
};

export class ObjectSpreadSerializer extends NodeSerializer<ObjectSpreadNode, ObjectSpreadSerializerChildren> {
    serialize(node: ObjectSpreadNode, context: SerializingContext): string {
        return `{ ${node.items.map((item) => this.child.object_spread_item(item, context))} }`;
    }
}
