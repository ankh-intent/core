import { TokenMatcher } from '@intent/kernel';

import { FunctorBodyNode, BlockNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
    block_expression: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
    protected build(tokens: TokenMatcher) {
        return new FunctorBodyNode(this.child.block_expression(tokens));
    }
}
