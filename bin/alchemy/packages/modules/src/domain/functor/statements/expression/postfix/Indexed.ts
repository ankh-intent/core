import { ExpressionNode } from '@alchemy/ast';
import { Operation } from '../Operation';

export class Indexed extends Operation<ExpressionNode> {
    public readonly binary = false;
    public readonly operation = '[';

    toString(): string {
        return `[${this.right}]`;
    }
}
