import { BinaryOperationNode } from './BinaryOperationNode';
import { ExpressionNode } from './ExpressionNode';

export class IndexedNode extends BinaryOperationNode {
  constructor(expression: ExpressionNode) {
    super('[', expression);
  }
}
