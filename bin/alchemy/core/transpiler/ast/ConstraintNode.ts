import { AbstractNode } from '@intent/kernel/ast';

import { CanNode } from './CanNode';

export class ConstraintNode extends AbstractNode {
  public constructor(
    public can: CanNode,
  ) {
    super();
  }
}
