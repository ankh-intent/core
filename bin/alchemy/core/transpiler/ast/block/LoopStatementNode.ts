import { BlockNode } from './BlockNode';
import { LoopIteratorNode } from './LoopIteratorNode';
import { StatementNode } from './StatementNode';

export class LoopStatementNode extends StatementNode {
  constructor(
    public iterator: LoopIteratorNode,
    public block: BlockNode,
  ) {
    super();
  }

  get isAssertion() {
    return false;
  }
}
