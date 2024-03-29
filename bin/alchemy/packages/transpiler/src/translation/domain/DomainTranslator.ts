import { TranslationContext } from '@intent/translator';
import {
    CastNode,
    DomainNode,
    FunctorNode,
    UsesNode,
    ReferenceNode,
    DomainInterfaceNode,
    AssignmentStatementNode,
    TraitNode,
    ConstraintNode,
    DomainModifierNode,
    GenericTemplatesNode,
} from '@alchemy/ast';
import { Domain, DeclarationRegistry, Qualifier, Trait } from '@alchemy/modules';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DomainTranslatorChildren = {
    domain_modifier: DomainModifierNode;
    reference: ReferenceNode;
    generics: GenericTemplatesNode;
    interface: DomainInterfaceNode;
    domain: DomainNode;
    uses: UsesNode;
    functor: FunctorNode;
    assignment_statement: AssignmentStatementNode;
    trait: TraitNode<DomainNode>;
    constraint: ConstraintNode;
    cast: CastNode;
};

export class DomainTranslator extends AlchemyNodeTranslator<Domain, DomainTranslatorChildren> {
    translate(node: DomainNode, context: TranslationContext<any>): Domain {
        const { node: domain, context: inner } = context.spawn(Domain, node, (domain) => ({
            modifier: this.child.domain_modifier(node.modifier, context),
            inherits: node.inherits,
            qualifier: Qualifier.create(domain, {
                name: node.identifier,
            }),
        }));

        DeclarationRegistry
            .search(context.parentNode)!
            .registerDeclaration(domain);

        domain.uses = this.child.uses(node.uses, inner);
        domain.generic = this.child.generics(node.generics, inner);

        for (const sub of node.domains.values()) {
            this.child.domain(sub, inner);
        }

        domain.parent = node.parent && this.child.reference(node.parent, inner);

        for (const [identifier, castNode] of node.casts) {
            domain.casts.set(identifier, this.child.cast(castNode, inner));
        }

        for (const traitNode of node.traits) {
            const trait: Trait = this.child.trait(traitNode, inner);
            const type = trait.toTypeString();

            if (domain.traits.has(type)) {
                throw new Error(`Trait with the same type "${type}" already present`);
            }

            domain.traits.set(type, trait);
        }

        for (const constraintNode of node.constraints) {
            domain.constraints.add(this.child.constraint(constraintNode, inner));
        }

        for (const [identifier, assignmentNode] of node.privates) {
            domain.privates.set(identifier, this.child.assignment_statement(assignmentNode, inner));
        }

        for (const [method, methodNode] of node.methods) {
            domain.functors.set(method, this.child.functor(methodNode, inner));
        }

        domain.intf = this.child.interface(node.interfaced, inner);
        domain.ctor = node.ctor && this.child.functor(node.ctor, inner);

        return domain;
    }
}
