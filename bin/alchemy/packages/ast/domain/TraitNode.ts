import { AbstractNode, TreeNode } from '@intent/kernel';
import { ExpressionNode } from '../expression';

export class TraitNode extends AbstractNode {
    constructor(
        public identifier: string,
        public expression: ExpressionNode,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [this.expression];
    }
}
