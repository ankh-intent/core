import { ExpressionStatementNode } from '@alchemy/ast';
import { Expression } from './expression';
import { Statement } from './Statement';

export class ExpressionStatement extends Statement<ExpressionStatementNode> {
    public expression: Expression;

    toString() {
        return `${this.expression}`;
    }
}
