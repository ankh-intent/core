import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { BlockNode, StatementNode, IfStatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type IfStatementChildren = {
    block: BlockNode;
    statement: StatementNode;
};

export class IfStatementBuilder extends BaseBuilder<IfStatementNode, IfStatementChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('if');
        ensure.symbol('(');

        const condition = this.child.statement(tokens);

        ensure.symbol(')');

        const ifTrue = this.child.block(tokens);
        const ifFalse = get.identifier('else') ? this.child.block(tokens) : null;

        return new IfStatementNode(
            condition,
            ifTrue,
            ifFalse,
        );
    }
}
