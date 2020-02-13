import { AbstractNode } from '@intent/kernel/ast';

export class BinaryOperationNode extends AbstractNode {
  constructor(
    public operation: string,
    public right: AbstractNode,
  ) {
    super();
  }
}
