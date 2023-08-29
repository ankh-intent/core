import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { CallArgsNode, CallNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type CallChildren = {
    call_args: CallArgsNode;
};

export class CallBuilder extends BaseBuilder<CallNode, CallChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('(');
        const args = this.child.call_args(tokens);
        ensure.symbol(')');

        return new CallNode(args);
    }
}
