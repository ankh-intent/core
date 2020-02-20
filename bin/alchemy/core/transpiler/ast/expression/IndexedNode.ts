import { BinaryOperationNode } from './BinaryOperationNode';
import { ExpressionNode } from './ExpressionNode';

export class IndexedNode extends BinaryOperationNode<ExpressionNode> {
  constructor(expression: ExpressionNode) {
    super('[', expression);
  }
}
