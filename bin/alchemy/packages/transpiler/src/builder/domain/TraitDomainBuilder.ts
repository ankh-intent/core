import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import {
    DomainNode,
    UsesNode,
    DomainInterfaceNode,
    GenericTemplatesNode,
    ConstraintNode,
    DomainModifierNode,
} from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type TraitDomainChildren = {
    generic_templates: GenericTemplatesNode;
    constraint: ConstraintNode;
    domain_interface: DomainInterfaceNode;
    uses: UsesNode;
};

export class TraitDomainBuilder extends BaseBuilder<DomainNode, TraitDomainChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const hasBody = this.notAbstract(tokens);

        const identifier = ensure.identifier();
        const generics = this.child.generic_templates(tokens);

        ensure.identifier('is');

        const constraints = new Set<ConstraintNode>([this.child.constraint(tokens)]);
        const interfaced = this.child.domain_interface(tokens);
        const uses = this.child.uses(tokens);

        return new DomainNode(
            identifier,
            new DomainModifierNode(),
            generics,
            undefined,
            true,
            interfaced,
            uses,
            constraints,
        );
    }
}
