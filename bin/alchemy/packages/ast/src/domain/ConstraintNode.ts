import { AbstractNode, TreeNode } from '@intent/kernel';
import { ExpressionNode } from '../expression';
import { ReferenceNode } from '../reference';

export class ConstraintNode extends AbstractNode {
    constructor(
        public type: ReferenceNode,
        public expression: ExpressionNode | null,
    ) {
        super();
    }

    get children(): TreeNode[] {
        return [this.type, this.expression!].filter(Boolean);
    }
}
