import { TypedTokenMatcherInterface } from '@intent/parser';

import { IdentifierNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type IdentifierExpressionChildren = {
  identifier: IdentifierNode;
};

export class IdentifierExpressionBuilder extends BaseBuilder<ExpressionNode, IdentifierExpressionChildren> {
  protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
    return new ExpressionNode(
      this.child.identifier(tokens),
    );
  }
}
