import { TranslationContext } from '@intent/translator';
import { ObjectProperty } from '@alchemy/modules';
import { ObjectPropertyNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ObjectLiteralPropertyTranslatorChildren = {
    expression: ExpressionNode;
};

export class ObjectLiteralPropertyTranslator extends AlchemyNodeTranslator<ObjectProperty, ObjectLiteralPropertyTranslatorChildren> {
    translate(node: ObjectPropertyNode, context: TranslationContext<any>): ObjectProperty {
        return ObjectProperty.create(node, context.parentNode, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, context),
        });
    }
}
