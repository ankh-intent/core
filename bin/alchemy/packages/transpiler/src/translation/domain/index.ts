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
} from '@alchemy/ast';

import { DomainReferenceTranslatorChildren, DomainReferenceTranslator } from './DomainReferenceTranslator';
import { DomainTranslatorChildren, DomainTranslator } from './DomainTranslator';
import { GenericTemplateTranslatorChildren, GenericTemplateTranslator } from './GenericTemplateTranslator';
import { InterfacePropertyTranslatorChildren, InterfacePropertyTranslator } from './InterfacePropertyTranslator';
import { InterfaceTranslatorChildren, InterfaceTranslator } from './InterfaceTranslator';
import { QualifierTranslatorChildren, QualifierTranslator } from './QualifierTranslator';
import { TraitTranslatorChildren, TraitTranslator } from './TraitTranslator';
import { ConstraintTranslatorChildren, ConstraintTranslator } from './ConstraintTranslator';
import { DomainModifierTranslatorChildren, DomainModifierTranslator } from './DomainModifierTranslator';

export type DomainInvokers = {
    domain_modifier: DomainModifierNode,
    domain: DomainNode;
    interface: DomainInterfaceNode;
    interface_property: DomainInterfacePropertyNode;
    reference: ReferenceNode;
    template: GenericTemplateNode;
    qualifier: QualifierNode;
    trait: TraitNode;
    constraint: ConstraintNode;
};

export type DomainDependencies =
    DomainModifierTranslatorChildren &
    InterfaceTranslatorChildren &
    InterfacePropertyTranslatorChildren &
    DomainTranslatorChildren &
    GenericTemplateTranslatorChildren &
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
        qualifier: new QualifierTranslator(invokers),
        trait: new TraitTranslator(invokers),
        constraint: new ConstraintTranslator(invokers),
    };
};
