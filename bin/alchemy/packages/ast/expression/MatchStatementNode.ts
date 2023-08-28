import { InspectOptionsStylized, inspect } from 'node:util';
import { AbstractNode } from '@intent/kernel';
import { ExpressionNode } from './ExpressionNode';
import { ObjectNode } from '../literal';

export class MatchStatementNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
    constructor(
        public body: N,
        public expression?: ExpressionNode,
        public destruct?: ObjectNode,
    ) {
        super();
    }

    get children() {
        return [this.expression!, this.body].filter(Boolean);
    }

    inspect(options: InspectOptionsStylized): any {
        if (this.expression || this.destruct) {
            return this;
        }

        const { astRegion, expression, destruct, ...rest } = this;

        return Object.keys(rest).length > 1 ? rest : '::body -> ' + inspect(this.body, options);
    }
}
