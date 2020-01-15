import { AbstractNode } from '@intent/kernel/ast';

import { QualifierNode } from './QualifierNode';

export class TypeNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public generic: any,
  ) {
    super();
  }
}
