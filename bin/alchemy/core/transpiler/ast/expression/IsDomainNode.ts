import { TypeNode } from '../reference';
import { BinaryOperationNode } from './BinaryOperationNode';

export class IsDomainNode extends BinaryOperationNode<TypeNode> {
  constructor(domain: TypeNode) {
    super('is', domain);
  }
}
