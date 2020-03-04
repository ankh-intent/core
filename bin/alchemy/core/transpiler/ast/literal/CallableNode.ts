import { AbstractNode } from '@intent/kernel';

import { FunctorNode } from '../functor';

export class CallableNode extends AbstractNode {
  constructor(
    public functor: FunctorNode,
  ) {
    super();
  }
}
