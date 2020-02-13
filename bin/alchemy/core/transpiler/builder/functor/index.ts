import { BuilderInvokers, InvokableVisitors } from '@intent/kernel/transpiler';

import { FunctorNode, FunctorArgsNode, FunctorBodyNode, FunctorArgNode } from '../../ast';
import { FunctorArgChildren, FunctorArgBuilder } from './FunctorArgBuilder';
import { FunctorArgsChildren, FunctorArgsBuilder } from './FunctorArgsBuilder';
import { FunctorBodyChildren, FunctorBodyBuilder } from './FunctorBodyBuilder';
import { FunctorChildren, FunctorBuilder } from './FunctorBuilder';

export type FunctorInvokers = {
  functor: FunctorNode;
  functor_arg: FunctorArgNode;
  functor_args: FunctorArgsNode;
  functor_body: FunctorBodyNode;
};
export type FunctorDependencies =
  FunctorArgsChildren &
  FunctorArgChildren &
  FunctorBodyChildren &
  FunctorChildren;

export const factory = (invokers: BuilderInvokers<FunctorDependencies>): InvokableVisitors<FunctorInvokers> => {
  return {
    functor     : new FunctorBuilder(invokers),
    functor_args: new FunctorArgsBuilder(invokers),
    functor_arg : new FunctorArgBuilder(invokers),
    functor_body: new FunctorBodyBuilder(invokers),
  };
};
