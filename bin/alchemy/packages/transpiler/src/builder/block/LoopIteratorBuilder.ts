import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode } from '@alchemy/ast';
import { AssignmentTargetNode, LoopIteratorNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type LoopIteratorChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

export class LoopIteratorBuilder extends BaseBuilder<LoopIteratorNode, LoopIteratorChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const target = this.child.assignment_target(tokens);

        ensure.identifier('of');

        const iterable = this.child.expression(tokens);

        return new LoopIteratorNode(
            target,
            iterable,
        );
    }
}
