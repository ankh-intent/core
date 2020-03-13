import { InvokableVisitors, NodeInvokers } from '@intent/plugins';

import { UseNode, UsesNode } from '../../../ast';
import { UseTranslator, UseTranslatorChildren } from './UseTranslator';
import { UsesTranslator, UsesTranslatorChildren } from './UsesTranslator';

export type UseInvokers = {
  use: UseNode;
  uses: UsesNode;
};

export type UseDependencies =
  UseTranslatorChildren &
  UsesTranslatorChildren
;

export const factory = (invokers: NodeInvokers<UseDependencies>): InvokableVisitors<UseInvokers> => {
  return {
    use : new UseTranslator(invokers),
    uses: new UsesTranslator(invokers),
  };
};
