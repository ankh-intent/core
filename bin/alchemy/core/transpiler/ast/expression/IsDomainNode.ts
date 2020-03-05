import { TypeNode } from '../reference';
import { OperationNode } from './OperationNode';

export class IsDomainNode extends OperationNode<TypeNode> {
  constructor(domain: TypeNode) {
    super('is', domain, true);
  }
}
