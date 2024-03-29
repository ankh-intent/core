import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode, MatchStatementNode, BlockNode, StatementNode, DereferenceNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type MatchStatementChildren = {
    expression: ExpressionNode;
    block: BlockNode;
    block_statement: StatementNode;
    expression_statement: StatementNode;
    dereference: DereferenceNode;
};

export class MatchStatementBuilder extends BaseBuilder<MatchStatementNode<BlockNode>, MatchStatementChildren> {
    protected build(tokens: TokenMatcher, { get, ensure, peek }: TypedTokenMatcherInterface) {
        let expression: ExpressionNode | undefined;
        let destruct: DereferenceNode | undefined;

        if (get.identifier('case')) {
            expression = this.child.expression(tokens);
        }

        if (get.identifier('with')) {
            destruct = this.child.dereference(tokens);
        }

        if (expression || destruct) {
            ensure.symbol(':');
        }

        const body = peek.symbol('{') ? this.child.block(tokens) : new BlockNode([
            this.child.expression_statement(tokens),
        ]);

        return new MatchStatementNode(
            body,
            expression,
            destruct,
        );
    }
}
