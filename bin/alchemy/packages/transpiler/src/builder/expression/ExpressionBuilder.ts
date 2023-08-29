import { TokenMatcher } from '@intent/kernel';

import { ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type ExpressionChildren = {
    boolean: ExpressionNode;
};

export class ExpressionBuilder extends BaseBuilder<ExpressionNode, ExpressionChildren> {
    protected build(tokens: TokenMatcher) {
        return this.child.boolean(tokens);
    }
}
