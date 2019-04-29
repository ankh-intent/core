import { AbstractNode } from '@intent/kernel/ast/AbstractNode';

import { TypeNode } from './TypeNode';

export class PropertyNode extends AbstractNode {
  public constructor(
    public name: string,
    public type: TypeNode,
  ) {
    super();
  }
}
