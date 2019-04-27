import { AbstractNode } from '@intent/kernel/ast/AbstractNode';

import { QualifierNode } from './QualifierNode';

export class UseNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public alias: string,
  ) {
    super();
  };
}
