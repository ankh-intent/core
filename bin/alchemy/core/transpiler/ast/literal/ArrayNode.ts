import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../expression';

export class ArrayNode extends AbstractNode {
  constructor(
    public items: ExpressionNode[] = [],
  ) {
    super();
  }
}
