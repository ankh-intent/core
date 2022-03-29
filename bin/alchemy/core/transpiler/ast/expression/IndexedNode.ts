import { OperationNode } from './OperationNode';
import { ExpressionNode } from './ExpressionNode';

export class IndexedNode extends OperationNode<ExpressionNode> {
  constructor(expression: ExpressionNode) {
    super('[', expression);
  }
}
