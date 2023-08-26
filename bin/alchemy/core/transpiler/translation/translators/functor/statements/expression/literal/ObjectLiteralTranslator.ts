import { ObjectLiteral } from '../../../../../../../modules';
import { ObjectNode, ObjectPropertyNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type ObjectLiteralTranslatorChildren = {
    object_property: ObjectPropertyNode;
};

export class ObjectLiteralTranslator extends NodeTranslator<ObjectLiteral, ObjectLiteralTranslatorChildren> {
    translate(node: ObjectNode, context: TranslationContext<any>): ObjectLiteral {
        return ObjectLiteral.create(node, context.parent, {
            properties: new Map(
                [...node.properties.entries()]
                    .map(([name, prop]) => [name, this.child.object_property(prop, context)]),
            ),
        });
    }
}
