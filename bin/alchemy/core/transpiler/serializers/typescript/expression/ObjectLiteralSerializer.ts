import { ObjectNode, ObjectPropertyNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ObjectLiteralSerializerChildren {
  // object_property: ObjectPropertyNode;
}

export class ObjectLiteralSerializer extends NodeSerializer<ObjectNode, ObjectLiteralSerializerChildren> {
  serialize(node: ObjectNode): string {
    return `{${this.wrapInlineList(
      [...node.properties.entries()]
        .map(([name, property]) => `${name}: ${property.astRegion.extract()}`)
    )}}`
  }
}
