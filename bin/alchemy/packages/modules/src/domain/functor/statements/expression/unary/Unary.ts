import { UnaryNode } from '@alchemy/ast';
import { Expression } from '../Expression';

export class Unary<N extends UnaryNode = UnaryNode> extends Expression<N, Expression<N>> {
    public readonly operations = [];
    public operators: string[];
    public pre?: string;
    public post?: string;

    toString() {
        return `${this.operators.join('')}${this.pre || ''}${this.base}${this.post || ''}`;
    }
}
