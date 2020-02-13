import { TypeNode } from '../reference';
import { BinaryOperationNode } from './BinaryOperationNode';

export class IsDomainNode extends BinaryOperationNode {
  constructor(domain: TypeNode) {
    super('is', domain);
  }
}
