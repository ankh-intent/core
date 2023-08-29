import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import {
    StatementNode,
    BreakStatementNode,
    ReturnStatementNode,
    IfStatementNode,
    LoopStatementNode,
} from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockItemChildren = {
    statement: StatementNode;
    break_statement: BreakStatementNode;
    return_statement: ReturnStatementNode;
    if_statement: IfStatementNode;
    loop_statement: LoopStatementNode;
};

export class BlockItemBuilder extends BaseBuilder<StatementNode, BlockItemChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        if (peek.identifier('if')) {
            return this.child.if_statement(tokens);
        } else if (peek.identifier('each')) {
            return this.child.loop_statement(tokens);
        }

        let statement;

        if (peek.identifier('break') || peek.identifier('continue')) {
            statement = this.child.break_statement(tokens);
        } else if (peek.identifier('return')) {
            statement = this.child.return_statement(tokens);
        } else {
            statement = this.child.statement(tokens);
        }

        ensure.symbol(';');

        return statement;
    }
}
