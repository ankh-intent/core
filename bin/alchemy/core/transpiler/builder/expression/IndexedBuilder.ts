import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ExpressionNode, IndexedNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type IndexedChildren = {
    expression: ExpressionNode;
}

export class IndexedBuilder extends BaseBuilder<IndexedNode, IndexedChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('[');
        const expression = this.child.expression(tokens);
        ensure.symbol(']');

        return new IndexedNode(expression);
    }
}
