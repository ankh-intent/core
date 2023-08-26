import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ReferenceNode, FunctorArgNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgChildren = {
    type: ReferenceNode;
};

export class FunctorArgBuilder extends BaseBuilder<FunctorArgNode, FunctorArgChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        const name = ensure.identifier();

        if (peek.symbol(':')) {
            tokens.mark('IS_FUNCTOR');
        }

        ensure.symbol(':');

        const type = this.child.type(tokens);

        return new FunctorArgNode(
            name,
            type,
        );
    }
}
