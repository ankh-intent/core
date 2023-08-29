import { ExpressionNode } from '../expression';
import { AssignmentStatementNode } from './AssignmentStatementNode';
import { AssignmentTargetNode } from './AssignmentTargetNode';

export class LoopIteratorNode extends AssignmentStatementNode {
    constructor(
        target: AssignmentTargetNode,
        iterable: ExpressionNode,
    ) {
        super(target, 'of', iterable);
    }
}
