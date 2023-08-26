import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { QualifierNode, ReferenceNode, TypeGenericNode, GenericTemplatesNode, GenericTemplateNode } from '@alchemy/ast';
import { GenericTemplateChildren, GenericTemplateBuilder } from './GenericTemplateBuilder';
import { GenericTemplatesChildren, GenericTemplatesBuilder } from './GenericTemplatesBuilder';
import { QualifierChildren, QualifierBuilder } from './QualifierBuilder';
import { TypeChildren, TypeBuilder } from './TypeBuilder';
import { TypeGenericChildren, TypeGenericBuilder } from './TypeGenericBuilder';

export type DomainReferenceInvokers = {
    qualifier: QualifierNode;
    type: ReferenceNode;
    type_generic: TypeGenericNode<ReferenceNode>;
    generic_templates: GenericTemplatesNode;
    generic_template: GenericTemplateNode;
};
export type DomainReferenceDependencies =
    QualifierChildren &
    TypeChildren &
    TypeGenericChildren &
    GenericTemplatesChildren &
    GenericTemplateChildren;

export const factory = (invokers: BuilderInvokers<DomainReferenceDependencies>): InvokableVisitors<DomainReferenceInvokers> => {
    return {
        qualifier: new QualifierBuilder(invokers),
        type: new TypeBuilder(invokers),
        type_generic: new TypeGenericBuilder(invokers),
        generic_templates: new GenericTemplatesBuilder(invokers),
        generic_template: new GenericTemplateBuilder(invokers),
    };
};
