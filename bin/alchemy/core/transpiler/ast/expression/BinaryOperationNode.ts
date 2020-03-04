import { AbstractNode } from '@intent/kernel';

export class BinaryOperationNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  constructor(
    public operation: string,
    public right: N,
  ) {
    super();
  }
}
