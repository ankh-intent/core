import { ObjectNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ObjectLiteralSerializerChildren = {
    // object_property: ObjectPropertyNode;
};

export class ObjectLiteralSerializer extends NodeSerializer<ObjectNode, ObjectLiteralSerializerChildren> {
    serialize(node: ObjectNode, context: SerializingContext): string {
        return `{${this.wrapInlineList(
            [...node.properties.entries()]
                .map(([name, property]) => `${name}: ${property.astRegion.extract()}`),
        )}}`;
    }
}
