import { TranslationContext } from '@intent/translator';
import { Interface } from '@alchemy/modules';
import { DomainInterfaceNode, DomainInterfacePropertyNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type InterfaceTranslatorChildren = {
    interface_property: DomainInterfacePropertyNode;
};

export class InterfaceTranslator extends AlchemyNodeTranslator<Interface, InterfaceTranslatorChildren> {
    translate(node: DomainInterfaceNode, context: TranslationContext<any>): Interface {
        return Interface.create(node, context.parentNode, {
            properties: new Map(
                [...node.properties.entries()]
                    .map(([key, value]) => [key, this.child.interface_property(value, context)]),
            ),
        });
    }
}
