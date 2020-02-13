import { BlockNode } from './BlockNode';
import { StatementNode } from './StatementNode';

export class IfStatementNode extends StatementNode {
  constructor(
    public condition: StatementNode,
    public ifTrue: BlockNode,
    public ifFalse: BlockNode|null = null,
  ) {
    super();
  }
}
