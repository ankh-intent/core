import { InspectOptionsStylized } from 'node:util';
import { AbstractNode } from '@intent/kernel';

export class OperationNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
    constructor(
        public readonly operation: string,
        public readonly right: N,
        public readonly binary: boolean = false,
    ) {
        super();
    }

    get children() {
        return [this.right];
    }

    inspect(_options: InspectOptionsStylized): any {
        if (this.binary) {
            return this;
        }

        const { binary, ...rest } = this;

        return rest;
    }
}
