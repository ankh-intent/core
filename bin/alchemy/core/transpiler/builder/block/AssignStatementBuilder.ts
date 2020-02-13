import { TypedTokenMatcherInterface } from '@intent/parser';

import { AssignmentStatementNode, ExpressionNode, AssignmentTargetNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignStatementChildren = {
  assignment_target: AssignmentTargetNode;
  expression: ExpressionNode;
};

export class AssignStatementBuilder extends BaseBuilder<AssignmentStatementNode, AssignStatementChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    const target = this.child.assignment_target(tokens);

    ensure.symbol('=');

    const expression = this.child.expression(tokens);

    return new AssignmentStatementNode(
      target,
      expression,
    );
  }
}
