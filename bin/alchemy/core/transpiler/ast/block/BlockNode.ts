import { AbstractNode } from '@intent/kernel';
import { ExpressionStatementNode } from './ExpressionStatementNode';
import { ReturnStatementNode } from './ReturnStatementNode';

import { StatementNode } from './StatementNode';

export class BlockNode extends AbstractNode {
    constructor(
        public statements: StatementNode[] = [],
    ) {
        super();
    }

    get children() {
        return this.statements;
    }

    get isExpressionStatement() {
        return (this.statements.length === 1) && this.statements[0] instanceof ExpressionStatementNode;
    }

    get isReturnStatement() {
        return (this.statements.length === 1) && this.statements[0] instanceof ReturnStatementNode;
    }
}
