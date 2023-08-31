import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { DomainNode, EnumNode, TraitNode, ConstraintNode, DomainModifierNode, CastNode } from '@alchemy/ast';
import { DomainModifierChildren, DomainModifierBuilder } from './DomainModifierBuilder';
import { DomainChildren, DomainBuilder } from './DomainBuilder';
import { EnumChildren, EnumBuilder } from './EnumBuilder';
import { TraitChildren, TraitBuilder } from './TraitBuilder';
import { TraitDomainChildren, TraitDomainBuilder } from './TraitDomainBuilder';
import { ConstraintChildren, ConstraintBuilder } from './ConstraintBuilder';
import { CastChildren, CastBuilder } from './CastBuilder';
import { factory as interfaceBuildersFactory, DomainInterfaceDependencies, DomainInterfaceInvokers } from './interface';

export type DomainInvokers = DomainInterfaceInvokers & {
    domain_modifier: DomainModifierNode;
    domain: DomainNode;
    enum: EnumNode;
    trait: TraitNode<DomainNode>;
    trait_domain: DomainNode;
    constraint: ConstraintNode;
    cast: CastNode;
};
export type DomainDependencies =
    DomainModifierChildren &
    DomainChildren &
    EnumChildren &
    TraitChildren &
    TraitDomainChildren &
    ConstraintChildren &
    CastChildren &
    DomainInterfaceDependencies;

export const factory = (invokers: BuilderInvokers<DomainDependencies>): InvokableVisitors<DomainInvokers> => {
    return {
        domain_modifier: new DomainModifierBuilder(invokers),
        domain: new DomainBuilder(invokers),
        enum: new EnumBuilder(invokers),
        trait: new TraitBuilder(invokers),
        trait_domain: new TraitDomainBuilder(invokers),
        constraint: new ConstraintBuilder(invokers),
        cast: new CastBuilder(invokers),
        ...interfaceBuildersFactory(invokers),
    };
};
