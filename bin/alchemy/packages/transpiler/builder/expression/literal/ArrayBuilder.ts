import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ArrayNode, ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ArrayChildren = {
    expression: ExpressionNode;
};

export class ArrayBuilder extends BaseBuilder<ArrayNode, ArrayChildren> {
    protected build(tokens: TokenMatcher, { peek, not, ensure }: TypedTokenMatcherInterface) {
        const items: ExpressionNode[] = [];

        ensure.symbol('[');

        while (!peek.symbol(']')) {
            items.push(this.child.expression(tokens));

            if (not.symbol(',')) {
                break;
            }
        }

        ensure.symbol(']');

        return new ArrayNode(
            items,
        );
    }
}
