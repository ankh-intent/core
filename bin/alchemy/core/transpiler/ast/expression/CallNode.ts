import { OperationNode } from './OperationNode';
import { CallArgsNode } from './CallArgsNode';

export class CallNode extends OperationNode<CallArgsNode> {
    constructor(args: CallArgsNode) {
        super('(', args);
    }
}
