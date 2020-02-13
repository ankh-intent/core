import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../expression';
import { AssignmentTargetNode } from './AssignmentTargetNode';

export class LoopIteratorNode extends AbstractNode {
  constructor(
    public target: AssignmentTargetNode,
    public iterable: ExpressionNode,
  ) {
    super();
  }
}
