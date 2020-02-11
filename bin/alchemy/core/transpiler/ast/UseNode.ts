import { AbstractNode } from '@intent/kernel/ast';

import { DecompositionNode } from './DecompositionNode';

export class UseNode extends AbstractNode {
  public constructor(
    public decomposition: DecompositionNode,
  ) {
    super();
  };

  get alias(): string {
    return this.decomposition.alias;
  }
}
