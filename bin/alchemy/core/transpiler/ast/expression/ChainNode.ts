import { OperationNode } from './OperationNode';
import { IdentifierNode } from './IdentifierNode';

export class ChainNode extends OperationNode<IdentifierNode> {
    constructor(identifier: IdentifierNode) {
        super('.', identifier);
    }
}
