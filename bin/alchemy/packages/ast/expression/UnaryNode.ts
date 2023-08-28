import { ExpressionNode } from './ExpressionNode';

export class UnaryNode<N extends ExpressionNode = ExpressionNode> extends ExpressionNode<N> {
    public readonly operation = [];

    constructor(
        base: N,
        public operators: string[],
        public pre?: string,
        public post?: string,
    ) {
        super(base);
    }

    get children() {
        return [this.base];
    }
}
