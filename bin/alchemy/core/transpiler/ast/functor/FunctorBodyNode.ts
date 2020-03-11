import { AbstractNode } from '@intent/kernel';

import { BlockNode } from '../block';

export class FunctorBodyNode extends AbstractNode {
  constructor(
    public block: BlockNode
  ) {
    super();
  }

  get children() {
    return [this.block];
  }

  get isExpressionStatement() {
    return this.block.isExpressionStatement;
  }

  get isReturnStatement() {
    return this.block.isReturnStatement;
  }
}
