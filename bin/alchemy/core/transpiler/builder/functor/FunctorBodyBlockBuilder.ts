import { TypedTokenMatcherInterface } from '@intent/parser';

import { BlockNode, StatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorBodyBlockChildren = {
  block: BlockNode;
  block_statement: StatementNode;
};

export class FunctorBodyBlockBuilder extends BaseBuilder<BlockNode, FunctorBodyBlockChildren> {
  protected build(tokens, { peek }: TypedTokenMatcherInterface) {
    if (peek.symbol('{')) {
      return this.child.block(tokens);
    }

    return new BlockNode([
      this.child.block_statement(tokens),
    ]);
  }
}
