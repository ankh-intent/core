import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ReferenceNode, QualifierNode, TypeGenericNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeChildren = {
    qualifier: QualifierNode;
    type: ReferenceNode;
    type_generic: TypeGenericNode<ReferenceNode>;
};

export class TypeBuilder extends BaseBuilder<ReferenceNode, TypeChildren> {
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
