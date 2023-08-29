import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectSpreadChildren = {
    object_spread_item: ObjectSpreadItemNode<ObjectSpreadNode>;
};

export class ObjectSpreadBuilder extends BaseBuilder<ObjectSpreadNode, ObjectSpreadChildren> {
    protected build(tokens: TokenMatcher, { not, ensure, peek }: TypedTokenMatcherInterface) {
        const items: ObjectSpreadItemNode<ObjectSpreadNode>[] = [];
        ensure.symbol('{');

        while (!peek.symbol('}')) {
            const item = this.child.object_spread_item(tokens);

            if (item) {
                items.push(item);
            } else {
                break;
            }

            if (not.symbol(',')) {
                break;
            }
        }

        ensure.symbol('}');

        return new ObjectSpreadNode(
            items,
        );
    }
}
