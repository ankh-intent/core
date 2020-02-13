import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../expression';
import { TypeNode } from '../TypeNode';

export class InterfacePropertyNode extends AbstractNode {
  constructor(
    public identifier: string,
    public expression: ExpressionNode|null,
    public type: TypeNode|null,
  ) {
    super();
  }
}
