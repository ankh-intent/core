import { TranslationContext } from '@intent/translator';
import { ObjectLiteral } from '@alchemy/modules';
import { ObjectNode, ObjectPropertyNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ObjectLiteralTranslatorChildren = {
    object_property: ObjectPropertyNode;
};

export class ObjectLiteralTranslator extends AlchemyNodeTranslator<ObjectLiteral, ObjectLiteralTranslatorChildren> {
    translate(node: ObjectNode, context: TranslationContext<any>): ObjectLiteral {
        return ObjectLiteral.create(node, context.parent, {
            properties: new Map(
                [...node.properties.entries()]
                    .map(([name, prop]) => [name, this.child.object_property(prop, context)]),
            ),
        });
    }
}
