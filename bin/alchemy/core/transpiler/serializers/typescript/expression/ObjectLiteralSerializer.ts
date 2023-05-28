import { ObjectNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ObjectLiteralSerializerChildren = {
    // object_property: ObjectPropertyNode;
};

export class ObjectLiteralSerializer extends NodeSerializer<ObjectNode, ObjectLiteralSerializerChildren> {
    serialize(node: ObjectNode, context): string {
        return `{${this.wrapInlineList(
            [...node.properties.entries()]
                .map(([name, property]) => `${name}: ${property.astRegion.extract()}`),
        )}}`;
    }
}
