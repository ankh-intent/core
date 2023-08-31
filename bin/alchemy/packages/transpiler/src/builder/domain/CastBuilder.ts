import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';

import { CastNode, FunctorNode, ReferenceNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type CastChildren = {
    type: ReferenceNode;
    functor: FunctorNode;
};

export class CastBuilder extends BaseBuilder<CastNode, CastChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const type = this.child.type(tokens);
        const hasBody = this.notAbstract(tokens);

        if (hasBody) {
            ensure.identifier('is');
        }

        return new CastNode(
            type,
            hasBody
                ? this.child.functor(tokens)
                : null
        );
    }
}
