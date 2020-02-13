import { AbstractNode } from '@intent/kernel/ast';

import { CallArgNode } from './CallArgNode';

export class CallArgsNode extends AbstractNode {
  constructor(
    public args: CallArgNode[],
  ) {
    super();
  }
}
