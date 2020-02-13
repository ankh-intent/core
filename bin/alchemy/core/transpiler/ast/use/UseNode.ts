import { AbstractNode } from '@intent/kernel/ast';

import { DecompositionNode } from '../reference/DecompositionNode';
import { QualifierNode } from '../reference/QualifierNode';

export class UseNode extends AbstractNode {
  public constructor(
    public decomposition: DecompositionNode,
  ) {
    super();
  };

  get alias(): string {
    return this.decomposition.alias;
  }

  get qualifier(): QualifierNode {
    return this.decomposition.qualifier;
  }
}
