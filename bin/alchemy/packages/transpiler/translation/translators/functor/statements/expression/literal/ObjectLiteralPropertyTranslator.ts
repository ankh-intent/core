import { ObjectProperty } from '@alchemy/modules';
import { ObjectPropertyNode, ExpressionNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type ObjectLiteralPropertyTranslatorChildren = {
    expression: ExpressionNode;
};

export class ObjectLiteralPropertyTranslator extends NodeTranslator<ObjectProperty, ObjectLiteralPropertyTranslatorChildren> {
    translate(node: ObjectPropertyNode, context: TranslationContext<any>): ObjectProperty {
        return ObjectProperty.create(node, context.parent, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, context),
        });
    }
}
