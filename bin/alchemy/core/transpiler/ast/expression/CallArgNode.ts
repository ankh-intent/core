import { AbstractNode } from '@intent/kernel/ast';

export class CallArgNode extends AbstractNode {
  constructor(
    public identifier: string|null,
    public expression: AbstractNode,
  ) {
    super();
  }
}
