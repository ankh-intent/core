import { AbstractNode } from '@intent/kernel';

export class TypeGenericNode<T extends AbstractNode> extends AbstractNode {
  public constructor(
    public genericTypes: T[] = [],
  ) {
    super();
  }
}
