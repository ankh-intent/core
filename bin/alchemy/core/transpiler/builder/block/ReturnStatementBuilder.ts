import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ReturnStatementNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type ReturnStatementChildren = {
    expression: ExpressionNode;
};

export class ReturnStatementBuilder extends BaseBuilder<ReturnStatementNode, ReturnStatementChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('return');

        if (!peek.symbol(';')) {
            return new ReturnStatementNode(
                this.child.expression(tokens),
            );
        }

        return new ReturnStatementNode();
    }
}
