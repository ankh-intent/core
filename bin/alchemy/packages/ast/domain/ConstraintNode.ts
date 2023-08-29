import { AbstractNode, TreeNode } from '@intent/kernel';
import { ExpressionNode } from '../expression';

export class ConstraintNode extends AbstractNode {
    constructor(
        public expression: ExpressionNode,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [this.expression];
    }
}
