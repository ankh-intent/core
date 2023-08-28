import { AbstractNode } from '@intent/kernel';
import { ExpressionNode } from './ExpressionNode';
import { MatchStatementNode } from './MatchStatementNode';

export class MatchNode extends AbstractNode {
    constructor(
        public expression: ExpressionNode,
        public statements: MatchStatementNode[] = [],
    ) {
        super();
    }

    get children() {
        return [this.expression, ...this.statements];
    }
}
