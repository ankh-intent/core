import { AbstractNode } from '@intent/kernel/ast';

export class TypeGenericNode<T extends AbstractNode> extends AbstractNode {
  public constructor(
    public genericTypes: T[] = [],
  ) {
    super();
  }
}
