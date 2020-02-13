import { AbstractNode } from '@intent/kernel/ast';

import { QualifierNode } from './QualifierNode';

export class DecompositionNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public alias: string,
    public children: {[qualifier: string]: DecompositionNode},
  ) {
    super();
  };
}
