import { ExpressionNode } from '../expression';
import { StatementNode } from './StatementNode';

export class ReturnStatementNode extends StatementNode {
    constructor(
        public expression: ExpressionNode | null = null,
    ) {
        super();
    }

    public get children() {
        return [this.expression!].filter(Boolean);
    }
}
