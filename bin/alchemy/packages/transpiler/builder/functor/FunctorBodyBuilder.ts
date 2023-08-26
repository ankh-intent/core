import { TokenMatcher } from '@intent/parser';

import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
    functor_body_block: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
    protected build(tokens: TokenMatcher) {
        return new FunctorBodyNode(this.child.functor_body_block(tokens));
    }
}
