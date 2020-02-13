import { AbstractNode } from '@intent/kernel/ast';

import { TypeNode } from '../reference';

export class FunctorArgNode extends AbstractNode {
  public constructor(
    public name: string|null,
    public type: TypeNode,
  ) {
    super();
  }
}
