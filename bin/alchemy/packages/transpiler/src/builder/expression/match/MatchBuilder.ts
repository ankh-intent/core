import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode, MatchStatementNode, MatchNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type MatchChildren = {
    expression: ExpressionNode;
    match_statement: MatchStatementNode;
};

export class MatchBuilder extends BaseBuilder<MatchNode, MatchChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('match');
        ensure.symbol('(');

        const expression = this.child.expression(tokens);

        ensure.symbol(')');

        ensure.symbol('=>');

        let singleStatement = !peek.symbol('{');
        let hasDefault = false;
        const statements: MatchStatementNode[] = [];
        let type: string | null;

        if (!singleStatement) {
            ensure.symbol('{');
        }

        while ((type = peek.identifier()) && (type === 'case' || type === 'with' || type === 'else')) {
            const statement = this.child.match_statement(tokens);

            if (!(statement.expression || statement.destruct)) {
                if (hasDefault) {
                    throw this.error(tokens, statement, 'Default case already exists');
                } else {
                    hasDefault = true;
                }
            }

            statements.push(statement);
        }

        if (!statements.length) {
            throw this.error(tokens, '@match', 'Expected @match case');
        }

        if (!singleStatement) {
            ensure.symbol('}');
        }

        return new MatchNode(
            expression,
            statements,
        );
    }
}
