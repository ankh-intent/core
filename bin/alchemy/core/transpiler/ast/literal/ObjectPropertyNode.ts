import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from '../expression';

export class ObjectPropertyNode extends AbstractNode {
  constructor(
    public identifier: string,
    public expression: ExpressionNode,
  ) {
    super();
  }
}
