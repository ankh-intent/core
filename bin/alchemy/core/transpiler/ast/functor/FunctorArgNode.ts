import { AbstractNode } from '@intent/kernel';

import { TypeNode } from '../reference';

export class FunctorArgNode extends AbstractNode {
  public constructor(
    public name: string,
    public type: TypeNode,
  ) {
    super();
  }
}
