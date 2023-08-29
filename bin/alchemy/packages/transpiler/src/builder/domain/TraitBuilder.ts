import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode, TraitNode, IdentifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type TraitChildren = {
    identifier: IdentifierNode;
    expression: ExpressionNode;
};

export class TraitBuilder extends BaseBuilder<TraitNode, TraitChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const identifier = ensure.identifier();

        ensure.identifier('is');

        const expression = this.child.expression(tokens);

        return new TraitNode(
            identifier,
            expression
        );
    }
}
