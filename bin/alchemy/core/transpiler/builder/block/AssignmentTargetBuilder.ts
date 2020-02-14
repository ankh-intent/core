import { TypedTokenMatcherInterface } from '@intent/parser';

import { AssignmentTargetNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignmentTargetChildren = {
  identifier_expression: ExpressionNode;
  expression: ExpressionNode;
};

export class AssignmentTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignmentTargetChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    if (get.identifier('let')) {
      return new AssignmentTargetNode(
        this.child.identifier_expression(tokens),
      );
    }

    return new AssignmentTargetNode(
      this.child.expression(tokens),
    );
  }
}
