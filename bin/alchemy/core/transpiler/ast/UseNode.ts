import { AbstractNode } from '@intent/kernel/ast';

import { QualifierNode } from './QualifierNode';

export class UseNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public alias: string,
  ) {
    super();
  };
}
