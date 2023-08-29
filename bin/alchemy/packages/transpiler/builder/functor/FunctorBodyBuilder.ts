import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';

import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
    block_expression: BlockNode;
    empty_block: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const hasBody = tokens.has('IS_ABSTRACT') < 0;

        if (hasBody) {
            ensure.symbol('=>');

            tokens.mark('IS_FUNCTOR');
        }

        return new FunctorBodyNode(
            hasBody
                ? this.child.block_expression(tokens)
                : this.child.empty_block(tokens)
        );
    }
}
