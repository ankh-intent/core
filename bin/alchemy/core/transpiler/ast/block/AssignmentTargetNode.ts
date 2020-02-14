import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../expression';

export class AssignmentTargetNode extends AbstractNode {
  constructor(
    public target: ExpressionNode,
  ) {
    super();
  }
}
