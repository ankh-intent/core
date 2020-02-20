import { BinaryOperationNode } from './BinaryOperationNode';
import { IdentifierNode } from './IdentifierNode';

export class ChainNode extends BinaryOperationNode<IdentifierNode> {
  constructor(identifier: IdentifierNode) {
    super('.', identifier);
  }
}
