import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { PostfixNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type PostfixChildren = {};

export class PostfixBuilder extends BaseBuilder<PostfixNode, PostfixChildren> {
    protected build(_tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        const operation = get.symbol('--') || get.symbol('++');

        if (operation) {
            return new PostfixNode(
                operation,
            );
        }

        return null;
    }
}
