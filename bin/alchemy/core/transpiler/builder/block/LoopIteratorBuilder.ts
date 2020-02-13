import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionNode } from '../../ast';
import { AssignmentTargetNode, LoopIteratorNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type LoopIteratorChildren = {
  assignment_target: AssignmentTargetNode;
  expression: ExpressionNode;
};

export class LoopIteratorBuilder extends BaseBuilder<LoopIteratorNode, LoopIteratorChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    const target = this.child.assignment_target(tokens);

    ensure.identifier('of');

    const iterable = this.child.expression(tokens);

    return new LoopIteratorNode(
      target,
      iterable,
    );
  }
}
