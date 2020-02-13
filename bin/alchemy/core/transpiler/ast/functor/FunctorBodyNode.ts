import { AbstractNode } from '@intent/kernel/ast';

import { BlockNode } from '../block';

export class FunctorBodyNode extends AbstractNode {
  constructor(
    public block: BlockNode
  ) {
    super();
  }
}
