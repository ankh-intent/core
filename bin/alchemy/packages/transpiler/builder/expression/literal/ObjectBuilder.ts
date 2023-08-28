import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectNode, ObjectPropertyNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectChildren = {
    object_property: ObjectPropertyNode;
};

export class ObjectBuilder extends BaseBuilder<ObjectNode, ObjectChildren> {
    protected build(tokens: TokenMatcher, { peek, not, ensure }: TypedTokenMatcherInterface) {
        ensure.symbol('{');

        const properties = new Map<string, ObjectPropertyNode>();

        while (!(peek.eof() || peek.symbol('}'))) {
            const property = this.child.object_property(tokens);

            if (properties.has(property.identifier)) {
                throw this.error(tokens, property, `Property with same name "${property.identifier}" already exists`);
            }

            properties.set(property.identifier, property);

            if (not.symbol(',')) {
                break;
            }
        }

        ensure.symbol('}');

        return new ObjectNode(
            properties,
        );
    }
}
