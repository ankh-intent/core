import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from './ExpressionNode';

export class UnaryNode<N extends AbstractNode = AbstractNode> extends ExpressionNode<N> {
  constructor(
    public operation: string,
    base: N,
  ) {
    super(base);
  }

  get children() {
    return [this.base];
  }
}
