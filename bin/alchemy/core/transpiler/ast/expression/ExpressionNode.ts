import { InspectOptionsStylized, inspect } from 'node:util';
import { AbstractNode } from '@intent/kernel';
import { OperationNode } from './OperationNode';

export class ExpressionNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
    constructor(
        public base: N,
        public operations: OperationNode[] = [],
    ) {
        super();
    }

    get children() {
        return [this.base, ...this.operations];
    }

    inspect(options: InspectOptionsStylized): any {
        if (this.operations.length) {
            return this;
        }

        const { astRegion, operations, ...rest } = this;

        return Object.keys(rest).length > 1 ? rest : '::base -> ' + inspect(this.base, options);
    }
}
