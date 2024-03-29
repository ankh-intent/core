import { AbstractNode, TreeNode } from '@intent/kernel';

import { QualifierNode } from './QualifierNode';

export class DecompositionNode extends AbstractNode {
    public constructor(
        public qualifier: QualifierNode,
        public alias: string,
        public items: { [qualifier: string]: DecompositionNode },
    ) {
        super();
    };

    get children(): TreeNode[] {
        return [this.qualifier, ...Object.values(this.items)];
    }

    inspect(): any {
        if (Object.keys(this.items).length) {
            return this;
        }

        const { items, ...rest } = this;

        return rest;
    }
}
