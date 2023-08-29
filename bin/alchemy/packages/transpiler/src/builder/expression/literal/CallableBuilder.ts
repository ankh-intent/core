import { TokenMatcher } from '@intent/kernel';

import { FunctorNode, CallableNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type CallableChildren = {
    functor: FunctorNode;
};

export class CallableBuilder extends BaseBuilder<CallableNode, CallableChildren> {
    protected build(tokens: TokenMatcher) {
        const functor = this.child.functor(tokens);

        return new CallableNode(
            functor,
        );
    }
}
