import { AbstractNode } from '@intent/kernel';
import { ExpressionNode, IdentifierNode } from '../expression';
import { AssignmentTargetNode } from './AssignmentTargetNode';
import { StatementNode } from './StatementNode';

export class AssignmentStatementNode<N extends AbstractNode = AbstractNode> extends StatementNode {
  constructor(
    public target: AssignmentTargetNode<N>,
    public operator: string,
    public expression: ExpressionNode,
  ) {
    super();
  }

  isDeclaration(): this is AssignmentStatementNode<IdentifierNode>  {
    return this.target.isDeclaration();
  }

  get targetBase(): N {
    return this.target.target.base;
  }
}
