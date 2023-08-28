import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { FunctorNode, ReferenceNode, FunctorArgsNode, FunctorBodyNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorChildren = {
    type: ReferenceNode;
    maybe_type: ReferenceNode;
    functor_args: FunctorArgsNode;
    functor_body: FunctorBodyNode;
}

export class FunctorBuilder extends BaseBuilder<FunctorNode, FunctorChildren> {
    protected build(tokens: TokenMatcher, { peek, get, ensure }: TypedTokenMatcherInterface) {
        const indexer = peek.symbol('[');

        ensure.symbol(indexer ? '[' : '(');

        const args = this.child.functor_args(tokens);

        ensure.symbol(indexer ? ']' : ')');

        const optional = !!get.symbol('?');
        const returns = get.symbol(':') ? (optional ? this.child.maybe_type(tokens) : this.child.type(tokens)) : null;

        ensure.symbol('=>');

        tokens.mark('IS_FUNCTOR');

        const body = this.child.functor_body(tokens);

        return new FunctorNode(
            args,
            returns,
            body,
        );
    }
}
