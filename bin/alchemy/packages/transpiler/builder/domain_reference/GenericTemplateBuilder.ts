import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { ReferenceNode, GenericTemplateNode, IdentifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericTemplateChildren = {
    identifier: IdentifierNode;
    type: ReferenceNode;
};

export class GenericTemplateBuilder extends BaseBuilder<GenericTemplateNode, GenericTemplateChildren> {
    protected build(tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        const identifier = this.child.identifier(tokens);
        const parent = get.symbol(':') ? this.child.type(tokens) : null;
        const def = get.symbol('=') ? this.child.type(tokens) : null;

        return new GenericTemplateNode(
            identifier,
            parent,
            def,
        );
    }
}
