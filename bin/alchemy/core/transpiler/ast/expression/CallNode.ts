import { inspect, InspectOptionsStylized } from 'node:util';
import { OperationNode } from './OperationNode';
import { CallArgsNode } from './CallArgsNode';

export class CallNode extends OperationNode<CallArgsNode> {
    constructor(args: CallArgsNode) {
        super('(', args);
    }

    inspect(options: InspectOptionsStylized): any {
        return '::right -> ' +  inspect(this.right, options);
    }
}
