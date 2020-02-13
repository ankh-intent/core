import { BinaryOperationNode } from './BinaryOperationNode';
import { IdentifierNode } from './IdentifierNode';

export class ChainNode extends BinaryOperationNode {
  constructor(identifier: IdentifierNode) {
    super('.', identifier);
  }
}
