import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';

import { ExpressionNode, ConstraintNode, ReferenceNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type ConstraintChildren = {
    type: ReferenceNode;
    expression: ExpressionNode;
};

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        const type = this.child.type(tokens);
        const expression = get.identifier('as') ? this.child.expression(tokens) : null;

        return new ConstraintNode(
            type,
            expression
        );
    }
}
