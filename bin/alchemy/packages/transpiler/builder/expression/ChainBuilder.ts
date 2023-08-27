import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { IdentifierNode, ChainNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type ChainChildren = {
    identifier: IdentifierNode;
};

export class ChainBuilder extends BaseBuilder<ChainNode, ChainChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('.');

        return new ChainNode(this.child.identifier(tokens));
    }
}
