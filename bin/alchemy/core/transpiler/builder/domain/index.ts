import { BuilderInvokers, InvokableVisitors } from '@intent/kernel';

import { DomainNode, EnumNode } from '../../ast';
import { DomainChildren, DomainBuilder } from './DomainBuilder';
import { EnumChildren, EnumBuilder } from './EnumBuilder';
import { factory as interfaceBuildersFactory, DomainInterfaceDependencies, DomainInterfaceInvokers } from './interface';

export type DomainInvokers = DomainInterfaceInvokers & {
  domain: DomainNode;
  enum: EnumNode;
};
export type DomainDependencies =
  DomainChildren &
  EnumChildren &
  DomainInterfaceDependencies;

export const factory = (invokers: BuilderInvokers<DomainDependencies>): InvokableVisitors<DomainInvokers> => {
  return {
    domain: new DomainBuilder(invokers),
    enum  : new EnumBuilder(invokers),
    ...interfaceBuildersFactory(invokers),
  };
};
