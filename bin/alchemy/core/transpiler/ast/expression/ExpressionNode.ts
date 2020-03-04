import { AbstractNode } from '@intent/kernel';

import { BinaryOperationNode } from './BinaryOperationNode';

export class ExpressionNode extends AbstractNode {
  constructor(
    public base: AbstractNode,
    public operations: BinaryOperationNode[] = [],
  ) {
    super();
  }
}
