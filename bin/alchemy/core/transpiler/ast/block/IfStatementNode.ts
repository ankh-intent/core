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

  get children() {
    return [this.condition, this.ifTrue, this.ifFalse!].filter(Boolean);
  }

  get isAssertion() {
    return false;
  }
}
