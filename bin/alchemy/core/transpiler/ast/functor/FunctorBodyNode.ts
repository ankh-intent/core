import { AbstractNode } from '@intent/kernel/ast';

export class FunctorBodyNode extends AbstractNode {
  constructor(
    public body: string
  ) {
    super();
  }
}
