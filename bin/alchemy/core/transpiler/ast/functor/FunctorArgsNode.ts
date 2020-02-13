import { AbstractNode } from '@intent/kernel/ast';

import { TypePropertyNode } from '../TypePropertyNode';

export class FunctorArgsNode extends AbstractNode {
  constructor(
    public args: {[name: string]: TypePropertyNode}
  ) {
    super();
  }
}
