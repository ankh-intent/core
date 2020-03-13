import { InvokableVisitors, NodeInvokers } from '@intent/plugins';

import { DomainNode, ReferenceNode, GenericTemplateNode, QualifierNode } from '../../../ast';

import { DomainReferenceTranslator, DomainReferenceTranslatorChildren } from './DomainReferenceTranslator';
import { DomainTranslator, DomainTranslatorChildren } from './DomainTranslator';
import { GenericTemplateTranslator, GenericTemplateTranslatorChildren } from './GenericTemplateTranslator';
import { QualifierTranslator, QualifierTranslatorChildren } from './QualifierTranslator';

export type DomainInvokers = {
  domain: DomainNode;
  reference: ReferenceNode;
  template: GenericTemplateNode;
  qualifier: QualifierNode;
};

export type DomainDependencies =
  DomainTranslatorChildren &
  GenericTemplateTranslatorChildren &
  QualifierTranslatorChildren &
  DomainReferenceTranslatorChildren
;

export const factory = (invokers: NodeInvokers<DomainDependencies>): InvokableVisitors<DomainInvokers> => {
  return {
    domain   : new DomainTranslator(invokers),
    reference: new DomainReferenceTranslator(invokers),
    template : new GenericTemplateTranslator(invokers),
    qualifier: new QualifierTranslator(invokers),
  };
};
