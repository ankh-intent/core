import { AbstractNode } from '@intent/kernel';

import { FunctorArgNode } from './FunctorArgNode';

export class FunctorArgsNode extends AbstractNode {
  constructor(
    public args: FunctorArgNode[] = []
  ) {
    super();
  }

  get children() {
    return this.args;
  }
}
