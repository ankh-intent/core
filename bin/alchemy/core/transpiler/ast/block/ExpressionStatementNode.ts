import { ExpressionNode } from '../expression';
import { StatementNode } from './StatementNode';

export class ExpressionStatementNode extends StatementNode {
  constructor(
    public expression: ExpressionNode,
  ) {
    super();
  }

  get children() {
    return [...super.children, this.expression];
  }
}
