import { AbstractNode } from '@intent/kernel/ast';

export class StatementNode extends AbstractNode {
  constructor(
  ) {
    super();
  }

  get isAssertion() {
    return true;
  }
}
