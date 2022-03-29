import { AbstractNode } from '@intent/kernel';

export class IdentifierNode extends AbstractNode {
  constructor(
    public name: string,
  ) {
    super();
  }
}
