import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { StatementNode, DecoratedStatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockStatementChildren = {
    block_item: StatementNode;
    decorated_statement: DecoratedStatementNode;
};

export class BlockStatementBuilder extends BaseBuilder<StatementNode, BlockStatementChildren> {
    protected build(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface) {
        if (peek.symbol('@')) {
            return this.child.decorated_statement(tokens);
        } else {
            return this.child.block_item(tokens);
        }
    }
}
