import { AbstractNode } from '@intent/kernel/ast';

import { TypeNode } from '../reference/TypeNode';

export class FunctorArgNode extends AbstractNode {
  public constructor(
    public name: string,
    public type: TypeNode,
  ) {
    super();
  }
}
