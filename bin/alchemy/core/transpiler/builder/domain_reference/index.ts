import { BuilderInvokers, InvokableVisitors } from '@intent/kernel/transpiler';

import { QualifierNode, TypeNode, TypeGenericNode } from '../../ast';
import { QualifierChildren, QualifierBuilder } from './QualifierBuilder';
import { TypeChildren, TypeBuilder } from './TypeBuilder';
import { TypeGenericChildren, TypeGenericBuilder } from './TypeGenericBuilder';

export type DomainReferenceInvokers = {
  qualifier: QualifierNode;
  type: TypeNode;
  type_generic: TypeGenericNode<TypeNode>;
};
export type DomainReferenceDependencies =
  QualifierChildren &
  TypeChildren &
  TypeGenericChildren;

export const factory = (invokers: BuilderInvokers<DomainReferenceDependencies>): InvokableVisitors<DomainReferenceInvokers> => {
  return {
    qualifier   : new QualifierBuilder(invokers),
    type        : new TypeBuilder(invokers),
    type_generic: new TypeGenericBuilder(invokers),
  };
};
