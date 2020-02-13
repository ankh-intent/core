import { ExpressionNode } from '../expression';
import { AssignmentTargetNode } from './AssignmentTargetNode';
import { StatementNode } from './StatementNode';

export class AssignmentStatementNode extends StatementNode {
  constructor(
    public target: AssignmentTargetNode,
    public expression: ExpressionNode,
  ) {
    super();
  }
}
