import { BuilderInvokers, InvokableVisitors } from '@intent/kernel/transpiler';

import { FunctorNode, FunctorArgsNode, FunctorBodyNode, FunctorArgNode, BlockNode } from '../../ast';
import { FunctorArgChildren, FunctorArgBuilder } from './FunctorArgBuilder';
import { FunctorArgsChildren, FunctorArgsBuilder } from './FunctorArgsBuilder';
import { FunctorBodyBlockChildren, FunctorBodyBlockBuilder } from './FunctorBodyBlockBuilder';
import { FunctorBodyChildren, FunctorBodyBuilder } from './FunctorBodyBuilder';
import { FunctorChildren, FunctorBuilder } from './FunctorBuilder';

export type FunctorInvokers = {
  functor: FunctorNode;
  functor_arg: FunctorArgNode;
  functor_args: FunctorArgsNode;
  functor_body: FunctorBodyNode;
  functor_body_block: BlockNode;
};
export type FunctorDependencies =
  FunctorArgsChildren &
  FunctorArgChildren &
  FunctorBodyChildren &
  FunctorBodyBlockChildren &
  FunctorChildren;

export const factory = (invokers: BuilderInvokers<FunctorDependencies>): InvokableVisitors<FunctorInvokers> => {
  return {
    functor           : new FunctorBuilder(invokers),
    functor_args      : new FunctorArgsBuilder(invokers),
    functor_arg       : new FunctorArgBuilder(invokers),
    functor_body      : new FunctorBodyBuilder(invokers),
    functor_body_block: new FunctorBodyBlockBuilder(invokers),
  };
};
