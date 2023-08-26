import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { DomainInterfaceNode, DomainInterfacePropertyNode } from '@alchemy/ast';
import { DomainInterfaceChildren, InterfaceBuilder } from './InterfaceBuilder';
import { DomainInterfacePropertyChildren, InterfacePropertyBuilder } from './InterfacePropertyBuilder';

export type DomainInterfaceInvokers = {
    domain_interface: DomainInterfaceNode;
    domain_interface_property: DomainInterfacePropertyNode;
};
export type DomainInterfaceDependencies =
    DomainInterfaceChildren &
    DomainInterfacePropertyChildren;

export const factory = (invokers: BuilderInvokers<DomainInterfaceDependencies>): InvokableVisitors<DomainInterfaceInvokers> => {
    return {
        domain_interface: new InterfaceBuilder(invokers),
        domain_interface_property: new InterfacePropertyBuilder(invokers),
    };
};
