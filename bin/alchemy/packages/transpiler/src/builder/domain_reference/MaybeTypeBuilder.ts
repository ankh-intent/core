import { TokenMatcher } from '@intent/kernel';

import { ReferenceNode, QualifierNode, TypeGenericNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type MaybeTypeChildren = {
    type: ReferenceNode;
};

export class MaybeTypeBuilder extends BaseBuilder<ReferenceNode, MaybeTypeChildren> {
    protected build(tokens: TokenMatcher) {
        const type = this.child.type(tokens);

        return new ReferenceNode(
            new QualifierNode('Maybe'),
            new TypeGenericNode([
                type,
            ]),
        );
    }
}
