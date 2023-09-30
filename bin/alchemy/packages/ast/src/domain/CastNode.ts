import { AbstractNode, TreeNode } from '@intent/kernel';
import { FunctorNode } from '../functor';
import { ReferenceNode } from '../reference';

export class CastNode extends AbstractNode {
    constructor(
        public type: ReferenceNode,
        public functor: FunctorNode | null,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [this.functor!].filter(Boolean);
    }
}
