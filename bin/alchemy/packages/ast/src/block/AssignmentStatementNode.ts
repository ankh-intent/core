import { AbstractNode } from '@intent/kernel';
import { ExpressionNode } from '../expression';
import { AssignmentTargetNode } from './AssignmentTargetNode';
import { StatementNode } from './StatementNode';
import { DereferenceNode } from '../spread';

export class AssignmentStatementNode<N extends AbstractNode = AbstractNode> extends StatementNode {
    constructor(
        public target: AssignmentTargetNode<N>,
        public operator: string,
        public expression: ExpressionNode,
    ) {
        super();
    }

    get children() {
        return [this.target, this.expression];
    }

    isDeclaration(): this is AssignmentStatementNode<DereferenceNode> {
        return this.target.isDeclaration();
    }

    get targetBase(): N {
        return this.target.target.base;
    }
}
