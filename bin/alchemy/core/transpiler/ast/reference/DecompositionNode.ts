import { AbstractNode } from '@intent/kernel';

import { QualifierNode } from './QualifierNode';

export class DecompositionNode extends AbstractNode {
  public constructor(
    public qualifier: QualifierNode,
    public alias: string,
    public items: {[qualifier: string]: DecompositionNode},
  ) {
    super();
  };

  get children() {
    return [this.qualifier, ...Object.values(this.items)];
  }
}
