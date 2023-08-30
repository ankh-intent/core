import { TranslationContext } from '@intent/translator';
import {
    CastNode,
    DomainNode,
    FunctorNode,
    UsesNode,
    ReferenceNode,
    GenericTemplateNode,
    DomainInterfaceNode,
    AssignmentStatementNode,
    TraitNode,
    ConstraintNode,
    DomainModifierNode,
} from '@alchemy/ast';
import { Domain, DeclarationRegistry, Qualifier } from '@alchemy/modules';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DomainTranslatorChildren = {
    domain_modifier: DomainModifierNode;
    reference: ReferenceNode;
    template: GenericTemplateNode;
    interface: DomainInterfaceNode;
    domain: DomainNode;
    uses: UsesNode;
    functor: FunctorNode;
    assignment_statement: AssignmentStatementNode;
    trait: TraitNode;
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
        domain.generics = node.generics.templates.map((g) => this.child.template(g, inner));

        for (const sub of node.domains.values()) {
            this.child.domain(sub, inner);
        }

        domain.parent = node.parent && this.child.reference(node.parent, inner);

        for (const [identifier, castNode] of node.casts) {
            domain.casts.set(identifier, this.child.cast(castNode, inner));
        }

        for (const [identifier, traitNode] of node.traits) {
            domain.traits.set(identifier, this.child.trait(traitNode, inner));
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
