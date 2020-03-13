import { InvokableVisitors, NodeInvokers } from '@intent/plugins';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode } from '../../../ast';

import { FunctorArgsTranslator, FunctorArgsTranslatorChildren } from './FunctorArgsTranslator';
import { FunctorBodyTranslator, FunctorBodyTranslatorChildren } from './FunctorBodyTranslator';
import { FunctorTranslator, FunctorTranslatorChildren } from './FunctorTranslator';

export type FunctorInvokers = {
  functor: FunctorNode;
  // functor_args: FunctorArgsNode;
  // functor_body: FunctorBodyNode;
};

export type FunctorDependencies =
  // FunctorArgsTranslatorChildren &
  // FunctorBodyTranslatorChildren &
  FunctorTranslatorChildren
;

export const factory = (invokers: NodeInvokers<FunctorDependencies>): InvokableVisitors<FunctorInvokers> => {
  return {
    functor     : new FunctorTranslator(invokers),
    // functor_args: new FunctorArgsTranslator(invokers),
    // functor_body: new FunctorBodyTranslator(invokers),
  };
};
