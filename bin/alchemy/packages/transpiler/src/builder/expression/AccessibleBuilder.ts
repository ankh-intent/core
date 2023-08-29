import { AbstractNode, TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import {
    ExpressionNode,
    ObjectNode,
    PrimitiveNode,
    IdentifierNode,
    ArrayNode,
    CallableNode,
    FunctorArgsNode,
    MatchNode,
    StatementNode,
} from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AccessibleChildren = {
    expression: ExpressionNode;
    statement: StatementNode;
    array: ArrayNode;
    object: ObjectNode;
    literal: PrimitiveNode;
    identifier: IdentifierNode;
    callable: CallableNode;
    functor_args: FunctorArgsNode;
    match: MatchNode;
};

export class AccessibleBuilder extends BaseBuilder<AbstractNode, AccessibleChildren> {
    protected build(tokens: TokenMatcher, { ensure, peek }: TypedTokenMatcherInterface) {
        const literal = this.child.literal(tokens);

        if (literal) {
            return literal;
        }

        if (peek.symbol('{')) {
            return this.child.object(tokens);
        } else if (peek.symbol('[')) {
            return this.child.array(tokens);
        } else if (peek.identifier('match')) {
            return this.child.match(tokens);
        } else if (peek.symbol('(')) {
            const callable = this.lookup('IS_FUNCTOR', tokens, this.child.callable);

            if (callable) {
                return callable;
            }

            ensure.symbol('(');

            const expression = new ExpressionNode(
                this.child.statement(tokens)
            );

            ensure.symbol(')');

            return expression;
        }

        return this.child.identifier(tokens);
    }
}
