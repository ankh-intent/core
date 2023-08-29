import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { DomainNode, EnumNode, TraitNode } from '@alchemy/ast';
import { DomainChildren, DomainBuilder } from './DomainBuilder';
import { EnumChildren, EnumBuilder } from './EnumBuilder';
import { TraitChildren, TraitBuilder } from './TraitBuilder';
import { factory as interfaceBuildersFactory, DomainInterfaceDependencies, DomainInterfaceInvokers } from './interface';

export type DomainInvokers = DomainInterfaceInvokers & {
    domain: DomainNode;
    enum: EnumNode;
    trait: TraitNode;
};
export type DomainDependencies =
    DomainChildren &
    EnumChildren &
    TraitChildren &
    DomainInterfaceDependencies;

export const factory = (invokers: BuilderInvokers<DomainDependencies>): InvokableVisitors<DomainInvokers> => {
    return {
        domain: new DomainBuilder(invokers),
        enum: new EnumBuilder(invokers),
        trait: new TraitBuilder(invokers),
        ...interfaceBuildersFactory(invokers),
    };
};
