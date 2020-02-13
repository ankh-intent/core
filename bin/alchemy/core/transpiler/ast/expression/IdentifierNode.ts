import { AbstractNode } from '@intent/kernel/ast';

export class IdentifierNode extends AbstractNode {
  constructor(
    public name: string,
  ) {
    super();
  }
}
