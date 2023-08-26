import { OperationNode } from './OperationNode';

export class PostfixNode extends OperationNode<never> {
    constructor(operation: string) {
        super(operation, undefined as never);
    }
}
