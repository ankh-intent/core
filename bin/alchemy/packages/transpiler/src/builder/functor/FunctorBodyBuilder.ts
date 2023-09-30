import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';

import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
    block_expression: BlockNode;
    empty_block: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const hasBody = this.notAbstract(tokens);

        if (hasBody) {
            ensure.symbol('=>');

            this.setFunctor(tokens);
        }

        return new FunctorBodyNode(
            hasBody
                ? this.child.block_expression(tokens)
                : this.child.empty_block(tokens)
        );
    }
}
