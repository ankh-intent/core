import { AbstractNode } from '@intent/kernel';

export class OperationNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  constructor(
    public readonly operation: string,
    public readonly right: N,
    public readonly binary: boolean = false,
  ) {
    super();
  }

  get children() {
    return [this.right];
  }
}
