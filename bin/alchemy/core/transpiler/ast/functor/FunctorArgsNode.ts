import { AbstractNode } from '@intent/kernel/ast';

import { FunctorArgNode } from './FunctorArgNode';

export class FunctorArgsNode extends AbstractNode {
  constructor(
    public args: {[name: string]: FunctorArgNode}
  ) {
    super();
  }
}
