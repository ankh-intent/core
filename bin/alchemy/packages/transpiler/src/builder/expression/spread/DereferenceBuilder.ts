import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectSpreadNode, DereferenceNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type DereferenceChildren = {
    object_spread: ObjectSpreadNode;
};

export class DereferenceBuilder extends BaseBuilder<DereferenceNode, DereferenceChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        const identifier = get.identifier();

        if (identifier) {
            return new DereferenceNode(
                identifier,
            );
        }

        const spread = this.child.object_spread(tokens);

        return new DereferenceNode(
            identifier,
            spread,
        );
    }
}
