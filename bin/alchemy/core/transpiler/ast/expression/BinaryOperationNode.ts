import { AbstractNode } from '@intent/kernel/ast';

export class BinaryOperationNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  constructor(
    public operation: string,
    public right: N,
  ) {
    super();
  }
}
