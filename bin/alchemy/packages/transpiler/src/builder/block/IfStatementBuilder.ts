import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { BlockNode, StatementNode, IfStatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type IfStatementChildren = {
    block_expression: BlockNode;
    statement: StatementNode;
};

export class IfStatementBuilder extends BaseBuilder<IfStatementNode, IfStatementChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('if');
        ensure.symbol('(');

        const condition = this.child.statement(tokens);

        ensure.symbol(')');

        const ifTrue = this.child.block_expression(tokens);
        const ifFalse = get.identifier('else') ? this.child.block_expression(tokens) : null;

        return new IfStatementNode(
            condition,
            ifTrue,
            ifFalse,
        );
    }
}
