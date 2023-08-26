import { TokenMatcher } from '@intent/parser';

import { UsesNode, UseNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type UsesChildren = {
    use: UseNode;
};

export class UsesBuilder extends BaseBuilder<UsesNode, UsesChildren> {
    protected build(tokens: TokenMatcher) {
        const uses = new Map<string, UseNode>();

        while (true) {
            const use = this.child.use(tokens);

            if (!use) {
                break;
            }

            if (uses.has(use.alias)) {
                throw this.error(tokens, use, `Use with the same name "${use.alias}" already present`);
            }

            uses.set(use.alias, use);
        }

        return new UsesNode(uses);
    }
}
