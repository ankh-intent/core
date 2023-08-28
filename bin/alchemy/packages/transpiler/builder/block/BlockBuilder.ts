import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { BlockNode, StatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockChildren = {
    block_statement: StatementNode;
};

export class BlockBuilder extends BaseBuilder<BlockNode, BlockChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        const statements: StatementNode[] = [];

        ensure.symbol('{');

        while (!(peek.eof() || peek.symbol('}'))) {
            statements.push(this.child.block_statement(tokens));
        }

        ensure.symbol('}');

        return new BlockNode(
            statements,
        );
    }
}
