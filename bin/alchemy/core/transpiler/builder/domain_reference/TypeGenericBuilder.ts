import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ReferenceNode, TypeGenericNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeGenericChildren = {
    type: ReferenceNode;
};

export class TypeGenericBuilder extends BaseBuilder<TypeGenericNode<ReferenceNode>, TypeGenericChildren> {
    protected build(tokens: TokenMatcher, { peek, ensure }: TypedTokenMatcherInterface) {
        const types: ReferenceNode[] = [];

        while (true) {
            if (types.length) {
                if (!peek.symbol(',')) {
                    break;
                }

                ensure.symbol(',');
            }

            const type = this.child.type(tokens);

            if (type) {
                types.push(type);
            } else {
                break;
            }
        }

        if (types.length) {
            return new TypeGenericNode<ReferenceNode>(
                types,
            );
        }

        return null;
    }
}
