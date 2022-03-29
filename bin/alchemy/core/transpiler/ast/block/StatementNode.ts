import { AbstractNode } from '@intent/kernel';

export class StatementNode extends AbstractNode {
  constructor(
  ) {
    super();
  }

  get isAssertion() {
    return true;
  }
}
