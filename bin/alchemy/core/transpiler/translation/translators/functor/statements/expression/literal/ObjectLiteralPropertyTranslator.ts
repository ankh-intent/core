import { ObjectProperty } from '../../../../../../../modules';
import { ObjectPropertyNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type ObjectLiteralPropertyTranslatorChildren = {
    expression: ExpressionNode;
};

export class ObjectLiteralPropertyTranslator extends NodeTranslator<ObjectProperty, ObjectLiteralPropertyTranslatorChildren> {
    translate(node: ObjectPropertyNode, c): ObjectProperty {
        return ObjectProperty.create(node, c.parent, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, c),
        });
    }
}
