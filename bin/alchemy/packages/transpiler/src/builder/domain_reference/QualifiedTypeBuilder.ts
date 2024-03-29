import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ReferenceNode, QualifierNode, TypeGenericNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type QualifiedTypeChildren = {
    qualifier: QualifierNode;
    type: ReferenceNode;
    type_generic: TypeGenericNode<ReferenceNode>;
};

export class QualifiedTypeBuilder extends BaseBuilder<ReferenceNode, QualifiedTypeChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        const qualifier = this.child.qualifier(tokens);
        let generic: TypeGenericNode<ReferenceNode> | null = null;
        let isArray = false;

        if (get.symbol('<')) {
            generic = this.child.type_generic(tokens);
            ensure.symbol('>');
        }

        if (get.symbol('[')) {
            isArray = true;
            ensure.symbol(']');
        }

        return new ReferenceNode(
            qualifier,
            generic,
            isArray,
        );
    }
}
