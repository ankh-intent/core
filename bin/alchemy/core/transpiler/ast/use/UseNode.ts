import { AbstractNode } from '@intent/kernel';

import { DecompositionNode, QualifierNode } from '../reference';

export class UseNode extends AbstractNode {
    public constructor(
        public decomposition: DecompositionNode,
    ) {
        super();
    };

    public get children() {
        return [this.decomposition];
    }

    get alias(): string {
        return this.decomposition.alias;
    }

    get qualifier(): QualifierNode {
        return this.decomposition.qualifier;
    }
}
