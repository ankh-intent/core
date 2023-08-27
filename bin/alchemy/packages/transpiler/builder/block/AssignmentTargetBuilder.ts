import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { AssignmentTargetNode, ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignmentTargetChildren = {
    identifier_expression: ExpressionNode;
    expression: ExpressionNode;
};

export class AssignmentTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignmentTargetChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        if (get.identifier('let')) {
            tokens.mark('IS_ASSIGNMENT');

            return new AssignmentTargetNode(
                this.child.identifier_expression(tokens),
            );
        }

        return new AssignmentTargetNode(
            this.child.expression(tokens),
            false,
        );
    }
}
