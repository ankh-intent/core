import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorBodyNode, BlockNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyChildren = {
  block: BlockNode;
};

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
  protected build(tokens, {}: TypedTokenMatcherInterface) {
    return new FunctorBodyNode(this.child.block(tokens));
  }
}
