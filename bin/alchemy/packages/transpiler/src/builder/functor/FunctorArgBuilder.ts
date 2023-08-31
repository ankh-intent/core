import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ReferenceNode, FunctorArgNode, QualifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgChildren = {
    type: ReferenceNode;
};

export class FunctorArgBuilder extends BaseBuilder<FunctorArgNode, FunctorArgChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        const name = ensure.identifier();

        if (get.symbol(':')) {
            this.setFunctor(tokens);

            const type = this.child.type(tokens);

            return new FunctorArgNode(
                name,
                type,
            );
        }

        return new FunctorArgNode(
            name,
            new ReferenceNode(
                new QualifierNode('$Call::Arg', new QualifierNode(name)),
            ),
        );
    }
}
