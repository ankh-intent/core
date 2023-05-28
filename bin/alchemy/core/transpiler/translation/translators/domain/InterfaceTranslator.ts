import { Interface } from '../../../../modules';
import { DomainInterfaceNode, DomainInterfacePropertyNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type InterfaceTranslatorChildren = {
    interface_property: DomainInterfacePropertyNode;
};

export class InterfaceTranslator extends NodeTranslator<Interface, InterfaceTranslatorChildren> {
    translate(node: DomainInterfaceNode, c): Interface {
        return Interface.create(node, c.parent, {
            properties: new Map(
                [...node.properties.entries()]
                    .map(([key, value]) => [key, this.child.interface_property(value, c)]),
            ),
        });
    }
}
