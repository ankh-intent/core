import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { UseNode, DecompositionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type UseChildren = {
    decomposition: DecompositionNode;
};

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
    protected build(tokens: TokenMatcher, { not, ensure }: TypedTokenMatcherInterface) {
        if (not.identifier('use')) {
            return null;
        }

        const decomposition = this.child.decomposition(tokens);

        ensure.symbol(';');

        return new UseNode(
            decomposition,
        );
    }
}
