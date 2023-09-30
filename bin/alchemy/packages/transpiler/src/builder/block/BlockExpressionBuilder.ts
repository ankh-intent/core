import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { BlockNode, StatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockExpressionChildren = {
    block: BlockNode;
    expression_statement: StatementNode;
};

export class BlockExpressionBuilder extends BaseBuilder<BlockNode, BlockExpressionChildren> {
    protected build(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface) {
        if (peek.symbol('{')) {
            return this.child.block(tokens);
        }

        return new BlockNode([
            this.child.expression_statement(tokens),
        ]);
    }
}
