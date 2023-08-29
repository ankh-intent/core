import { TokenMatcher } from '@intent/kernel';

import { ExpressionNode, ConstraintNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type ConstraintChildren = {
    expression: ExpressionNode;
};

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
    protected build(tokens: TokenMatcher) {
        const expression = this.child.expression(tokens);

        return new ConstraintNode(
            expression
        );
    }
}
