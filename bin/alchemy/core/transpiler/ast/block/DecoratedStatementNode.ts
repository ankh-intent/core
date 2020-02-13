import { ExpressionNode } from '../expression';
import { StatementNode } from './StatementNode';

export class DecoratedStatementNode extends StatementNode {
  constructor(
    public decorator: ExpressionNode,
    public item: StatementNode,
  ) {
    super();
  }
}
