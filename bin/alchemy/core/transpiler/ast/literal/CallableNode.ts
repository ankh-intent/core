import { AbstractNode } from '@intent/kernel/ast';

import { FunctorNode } from '../functor';

export class CallableNode extends AbstractNode {
  constructor(
    public functor: FunctorNode,
  ) {
    super();
  }
}
