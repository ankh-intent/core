import { InterfaceProperty } from '../../../../modules';
import { ReferenceNode, DomainInterfacePropertyNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type InterfacePropertyTranslatorChildren = {
    reference: ReferenceNode;
    expression: ExpressionNode;
};

export class InterfacePropertyTranslator extends NodeTranslator<InterfaceProperty, InterfacePropertyTranslatorChildren> {
    translate(node: DomainInterfacePropertyNode, context: TranslationContext<any>): InterfaceProperty {
        return InterfaceProperty.create(node, context.parent, {
            identifier: node.identifier,
            type: node.type && this.child.reference(node.type, context),
            expression: node.expression && this.child.expression(node.expression, context),
        });
    }
}
