import { TokenMatcher } from '@intent/kernel';

import { TraitNode, DomainNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type TraitChildren = {
    trait_domain: DomainNode;
};

export class TraitBuilder extends BaseBuilder<TraitNode<DomainNode>, TraitChildren> {
    protected build(tokens: TokenMatcher) {
        return new TraitNode(
            this.child.trait_domain(tokens),
        );
    }
}
