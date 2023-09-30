import { ReferenceNode } from '../reference';
import { OperationNode } from './OperationNode';

export class IsDomainNode extends OperationNode<ReferenceNode> {
    constructor(domain: ReferenceNode) {
        super('is', domain, true);
    }
}
