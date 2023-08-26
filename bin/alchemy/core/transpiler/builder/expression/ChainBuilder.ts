import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { IdentifierNode, ChainNode } from '../../ast';
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
