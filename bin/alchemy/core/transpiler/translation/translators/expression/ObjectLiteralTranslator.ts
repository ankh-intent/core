import { ObjectNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type ObjectLiteralTranslatorChildren = {
  // object_property: ObjectPropertyNode;
};

export class ObjectLiteralTranslator extends NodeTranslator<ObjectNode, ObjectLiteralTranslatorChildren> {
  translate(node: ObjectNode, context): string {
    return `{${this.wrapInlineList(
      [...node.properties.entries()]
        .map(([name, property]) => `${name}: ${property.astRegion.extract()}`)
    )}}`
  }
}
