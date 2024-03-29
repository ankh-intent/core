import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { DecoratedStatementNode, ExpressionNode, StatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type DecoratedStatementChildren = {
    expression: ExpressionNode;
    block_item: StatementNode;
};

export class DecoratedStatementBuilder extends BaseBuilder<StatementNode, DecoratedStatementChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('@');

        const decorator = this.child.expression(tokens);
        const item = this.child.block_item(tokens);

        return new DecoratedStatementNode(
            decorator,
            item,
        );
    }
}
