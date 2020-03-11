import { AbstractNode } from '@intent/kernel';

export class OperationNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  constructor(
    public operation: string,
    public right: N,
    public binary: boolean = false,
  ) {
    super();
  }

  get children() {
    return [this.right];
  }
}
