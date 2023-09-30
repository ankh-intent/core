import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ReferenceNode, QualifierNode, TypeGenericNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeChildren = {
    qualifier: QualifierNode;
    type: ReferenceNode;
    qualified_type: ReferenceNode;
    type_generic: TypeGenericNode<ReferenceNode>;
};

export class TypeBuilder extends BaseBuilder<ReferenceNode, TypeChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        let type: ReferenceNode;

        if (get.symbol('[')) {
            const types: ReferenceNode[] = [];

            while (true) {
                const type = this.child.type(tokens);

                types.push(type);

                if (!get.symbol(',')) {
                    break;
                }
            }

            ensure.symbol(']');

            type = new ReferenceNode(
                this.ast(new QualifierNode('Tuple'), tokens),
                this.ast(new TypeGenericNode(types), tokens)
            );
        } else {
            type = this.child.qualified_type(tokens);
        }

        while (get.symbol('[')) {
            ensure.symbol(']');

            type = new ReferenceNode(
                this.ast(new QualifierNode('Array'), tokens),
                this.ast(new TypeGenericNode([type]), tokens)
            );
        }

        return type;
    }
}
