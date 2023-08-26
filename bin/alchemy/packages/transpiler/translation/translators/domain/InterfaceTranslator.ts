import { Interface } from '@alchemy/modules';
import { DomainInterfaceNode, DomainInterfacePropertyNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type InterfaceTranslatorChildren = {
    interface_property: DomainInterfacePropertyNode;
};

export class InterfaceTranslator extends NodeTranslator<Interface, InterfaceTranslatorChildren> {
    translate(node: DomainInterfaceNode, context: TranslationContext<any>): Interface {
        return Interface.create(node, context.parent, {
            properties: new Map(
                [...node.properties.entries()]
                    .map(([key, value]) => [key, this.child.interface_property(value, context)]),
            ),
        });
    }
}
