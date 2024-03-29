import { Container } from '@intent/kernel';
import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { QualifierNode, DecompositionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type DecompositionChildren = {
    qualifier: QualifierNode;
    decomposition: DecompositionNode;
};

export class DecompositionBuilder extends BaseBuilder<DecompositionNode, DecompositionChildren> {
    protected build(tokens: TokenMatcher, { get, peek, ensure }: TypedTokenMatcherInterface) {
        const children: Container<DecompositionNode> = {};
        const qualifier = this.child.qualifier(tokens);
        let alias = qualifier.deepest();

        if (get.identifier('as')) {
            alias = ensure.identifier();
        } else if (get.symbol(':')) {
            ensure.symbol('{');

            while (peek.identifier()) {
                const decomposition = this.child.decomposition(tokens);

                if (children[decomposition.alias]) {
                    throw this.error(tokens, decomposition, `Use with the same name "${decomposition.alias}" already present`);
                }

                children[decomposition.alias] = decomposition;

                if (!peek.symbol(',')) {
                    break;
                }

                ensure.symbol(',');
            }

            ensure.symbol('}');
        }

        return new DecompositionNode(
            qualifier,
            alias,
            children,
        );
    }
}
