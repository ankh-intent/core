import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from '../../expression';
import { TypeNode } from '../../reference';

export class DomainInterfacePropertyNode extends AbstractNode {
  constructor(
    public identifier: string,
    public expression: ExpressionNode|null,
    public type: TypeNode|null,
  ) {
    super();
  }

  get children() {
    return [this.expression!, this.type!].filter(Boolean);
  }
}
