import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectSpreadNode, ObjectSpreadItemNode, IdentifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectSpreadItemChildren = {
    identifier: IdentifierNode;
    object_spread: ObjectSpreadNode;
};

export class ObjectSpreadItemBuilder extends BaseBuilder<ObjectSpreadItemNode<ObjectSpreadNode>, ObjectSpreadItemChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        if (get.symbol('...')) {
            const identifier = ensure.identifier();

            return new ObjectSpreadItemNode<ObjectSpreadNode>(identifier, null, true);
        }

        const identifier = ensure.identifier();
        const spread = get.symbol(':') ? this.child.object_spread(tokens) : null;

        return new ObjectSpreadItemNode<ObjectSpreadNode>(
            identifier,
            spread
        );
    }
}
