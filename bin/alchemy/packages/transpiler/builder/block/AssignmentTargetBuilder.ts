import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { AssignmentTargetNode, ExpressionNode, ReferenceNode, IdentifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignmentTargetChildren = {
    identifier_expression: ExpressionNode<IdentifierNode>;
    expression: ExpressionNode;
    type: ReferenceNode;
};

export class AssignmentTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignmentTargetChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        if (get.identifier('let')) {
            tokens.mark('IS_ASSIGNMENT');

            const target = this.child.identifier_expression(tokens);
            const type = get.symbol(':') ? this.child.type(tokens) : null;

            return new AssignmentTargetNode(
                target,
                type,
                target.base.name
            );
        }

        return new AssignmentTargetNode(
            this.child.expression(tokens),
        );
    }
}
