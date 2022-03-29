import { ExpressionNode } from './ExpressionNode';

export class UnaryNode<N extends ExpressionNode = ExpressionNode> extends ExpressionNode<N> {
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
