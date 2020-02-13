import { AbstractNode } from '@intent/kernel/ast';

import { StatementNode } from './StatementNode';

export class BlockNode extends AbstractNode {
  constructor(
    public statements: StatementNode[] = [],
  ) {
    super();
  }
}
