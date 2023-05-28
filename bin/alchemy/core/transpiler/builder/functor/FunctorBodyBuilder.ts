import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorBodyNode, BlockNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
    functor_body_block: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
    protected build(tokens, {}: TypedTokenMatcherInterface) {
        return new FunctorBodyNode(this.child.functor_body_block(tokens));
    }
}
