import { AbstractNode } from '@intent/kernel/ast';

import { IdentifierNode } from '../expression';

export class AssignmentTargetNode extends AbstractNode {
  constructor(
    public target: IdentifierNode,
  ) {
    super();
  }
}
