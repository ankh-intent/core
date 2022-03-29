import { ObjectLiteral } from '../../../../../../../modules';
import { ObjectNode, ObjectPropertyNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type ObjectLiteralTranslatorChildren = {
  object_property: ObjectPropertyNode;
};

export class ObjectLiteralTranslator extends NodeTranslator<ObjectLiteral, ObjectLiteralTranslatorChildren> {
  translate(node: ObjectNode, c): ObjectLiteral {
    return ObjectLiteral.create(node, c.parent, {
      properties: new Map(
        [...node.properties.entries()]
          .map(([name, prop]) => [name, this.child.object_property(prop, c)]),
      ),
    });
  }
}
