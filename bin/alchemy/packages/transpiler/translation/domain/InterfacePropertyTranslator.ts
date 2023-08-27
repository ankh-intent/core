import { TranslationContext } from '@intent/translator';
import { InterfaceProperty } from '@alchemy/modules';
import { ReferenceNode, DomainInterfacePropertyNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type InterfacePropertyTranslatorChildren = {
    reference: ReferenceNode;
    expression: ExpressionNode;
};

export class InterfacePropertyTranslator extends AlchemyNodeTranslator<InterfaceProperty, InterfacePropertyTranslatorChildren> {
    translate(node: DomainInterfacePropertyNode, context: TranslationContext<any>): InterfaceProperty {
        return InterfaceProperty.create(node, context.parent, {
            identifier: node.identifier,
            type: node.type && this.child.reference(node.type, context),
            expression: node.expression && this.child.expression(node.expression, context),
        });
    }
}
