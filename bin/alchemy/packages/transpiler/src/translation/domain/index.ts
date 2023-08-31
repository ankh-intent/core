import { InvokableVisitors, NodeInvokers } from '@intent/plugins';

import {
    DomainNode,
    ReferenceNode,
    GenericTemplateNode,
    QualifierNode,
    DomainInterfacePropertyNode,
    DomainInterfaceNode,
    TraitNode,
    ConstraintNode,
    DomainModifierNode,
    CastNode,
    GenericTemplatesNode,
} from '@alchemy/ast';

import { DomainReferenceTranslatorChildren, DomainReferenceTranslator } from './DomainReferenceTranslator';
import { DomainTranslatorChildren, DomainTranslator } from './DomainTranslator';
import { GenericTemplateTranslatorChildren, GenericTemplateTranslator } from './GenericTemplateTranslator';
import { GenericsTranslatorChildren, GenericsTranslator } from './GenericsTranslator';
import { InterfacePropertyTranslatorChildren, InterfacePropertyTranslator } from './InterfacePropertyTranslator';
import { InterfaceTranslatorChildren, InterfaceTranslator } from './InterfaceTranslator';
import { QualifierTranslatorChildren, QualifierTranslator } from './QualifierTranslator';
import { TraitTranslatorChildren, TraitTranslator } from './TraitTranslator';
import { ConstraintTranslatorChildren, ConstraintTranslator } from './ConstraintTranslator';
import { DomainModifierTranslatorChildren, DomainModifierTranslator } from './DomainModifierTranslator';
import { CastTranslatorChildren, CastTranslator } from './CastTranslator';

export type DomainInvokers = {
    domain_modifier: DomainModifierNode,
    domain: DomainNode;
    interface: DomainInterfaceNode;
    interface_property: DomainInterfacePropertyNode;
    reference: ReferenceNode;
    generics: GenericTemplatesNode;
    template: GenericTemplateNode;
    qualifier: QualifierNode;
    trait: TraitNode<DomainNode>;
    constraint: ConstraintNode;
    cast: CastNode;
};

export type DomainDependencies =
    CastTranslatorChildren &
    DomainModifierTranslatorChildren &
    InterfaceTranslatorChildren &
    InterfacePropertyTranslatorChildren &
    DomainTranslatorChildren &
    GenericTemplateTranslatorChildren &
    GenericsTranslatorChildren &
    QualifierTranslatorChildren &
    DomainReferenceTranslatorChildren &
    TraitTranslatorChildren &
    ConstraintTranslatorChildren
    ;

export const factory = (invokers: NodeInvokers<DomainDependencies>): InvokableVisitors<DomainInvokers> => {
    return {
        domain_modifier: new DomainModifierTranslator(invokers),
        domain: new DomainTranslator(invokers),
        interface: new InterfaceTranslator(invokers),
        interface_property: new InterfacePropertyTranslator(invokers),
        reference: new DomainReferenceTranslator(invokers),
        template: new GenericTemplateTranslator(invokers),
        generics: new GenericsTranslator(invokers),
        qualifier: new QualifierTranslator(invokers),
        trait: new TraitTranslator(invokers),
        constraint: new ConstraintTranslator(invokers),
        cast: new CastTranslator(invokers),
    };
};
