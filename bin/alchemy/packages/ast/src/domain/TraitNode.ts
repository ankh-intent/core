import { AbstractNode, TreeNode } from '@intent/kernel';

export class TraitNode<N extends AbstractNode> extends AbstractNode {
    constructor(
        public domain: N,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [this.domain];
    }
}
