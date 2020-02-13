import { AbstractNode } from '@intent/kernel/ast';

import { ExpressionNode } from '../../expression';
import { TypeNode } from '../../reference/TypeNode';

export class DomainInterfacePropertyNode extends AbstractNode {
  constructor(
    public identifier: string,
    public expression: ExpressionNode|null,
    public type: TypeNode|null,
  ) {
    super();
  }
}
