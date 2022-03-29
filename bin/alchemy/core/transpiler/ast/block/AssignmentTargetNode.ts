import { AbstractNode } from '@intent/kernel';

import { ExpressionNode, IdentifierNode } from '../expression';

export class AssignmentTargetNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
  private readonly _isDeclaration: boolean;

  constructor(
    public target: ExpressionNode<N>,
    isDeclaration: boolean = true,
  ) {
    super();
    this._isDeclaration = isDeclaration;
  }

  get children() {
    return [this.target];
  }

  isDeclaration(): this is AssignmentTargetNode<IdentifierNode>  {
    return this._isDeclaration;
  }
}
