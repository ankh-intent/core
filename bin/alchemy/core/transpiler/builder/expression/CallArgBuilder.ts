import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ExpressionNode, CallArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type CallArgChildren = {
    expression: ExpressionNode;
};

export class CallArgBuilder extends BaseBuilder<CallArgNode, CallArgChildren> {
    protected build(tokens: TokenMatcher, { get, peek, ensure }: TypedTokenMatcherInterface) {
        let identifier: string | null = null;

        if (peek.identifier() && peek.symbol(':', 1)) {
            identifier = get.identifier();

            ensure.symbol(':');
        }

        const expression = this.child.expression(tokens);

        return new CallArgNode(
            identifier,
            expression,
        );
    }
}
