import { TokenMatcher } from '@intent/kernel';

import { IdentifierNode, ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type IdentifierExpressionChildren = {
    identifier: IdentifierNode;
};

export class IdentifierExpressionBuilder extends BaseBuilder<ExpressionNode, IdentifierExpressionChildren> {
    protected build(tokens: TokenMatcher) {
        return new ExpressionNode(
            this.child.identifier(tokens),
        );
    }
}
