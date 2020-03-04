import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from '../expression';

export class AssignmentTargetNode extends AbstractNode {
  constructor(
    public target: ExpressionNode,
  ) {
    super();
  }
}
