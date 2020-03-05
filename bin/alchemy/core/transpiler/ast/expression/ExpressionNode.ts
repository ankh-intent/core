import { AbstractNode } from '@intent/kernel';

import { OperationNode } from './OperationNode';

export class ExpressionNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  constructor(
    public base: N,
    public operations: OperationNode[] = [],
  ) {
    super();
  }
}
