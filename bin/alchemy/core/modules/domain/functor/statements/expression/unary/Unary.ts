import { UnaryNode } from '../../../../../../transpiler';
import { Expression } from '../Expression';

export class Unary<N extends UnaryNode = UnaryNode> extends Expression<N, Expression<N>> {
    public readonly operations = [];
    public operation: string;

    toString() {
        return `${this.operation}${this.base}`;
    }
}
