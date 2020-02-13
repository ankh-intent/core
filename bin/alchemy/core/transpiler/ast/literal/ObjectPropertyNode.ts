import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../expression';

export class ObjectPropertyNode extends AbstractNode {
  constructor(
    public identifier: string,
    public expression: ExpressionNode,
  ) {
    super();
  }
}
