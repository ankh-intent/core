import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { AssignmentTargetNode, ExpressionNode, ReferenceNode, DereferenceNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignmentTargetChildren = {
    dereference: DereferenceNode;
    expression: ExpressionNode;
    type: ReferenceNode;
};

export class AssignmentTargetBuilder extends BaseBuilder<AssignmentTargetNode, AssignmentTargetChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        if (get.identifier('let')) {
            this.setAssignment(tokens);

            const target = this.child.dereference(tokens);
            const type = get.symbol(':') ? this.child.type(tokens) : null;

            return new AssignmentTargetNode(
                Object.assign(new ExpressionNode(target), {
                    astRegion: target.astRegion,
                }),
                type,
            );
        }

        return new AssignmentTargetNode(
            this.child.expression(tokens),
        );
    }
}
