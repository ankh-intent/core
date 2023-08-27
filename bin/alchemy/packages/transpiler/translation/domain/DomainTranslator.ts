import { TranslationContext } from '@intent/translator';
import {
    DomainNode,
    FunctorNode,
    UsesNode,
    ReferenceNode,
    GenericTemplateNode,
    DomainInterfaceNode,
} from '@alchemy/ast';
import { Domain, DeclarationRegistry, Qualifier } from '@alchemy/modules';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DomainTranslatorChildren = {
    reference: ReferenceNode;
    template: GenericTemplateNode;
    interface: DomainInterfaceNode;
    domain: DomainNode;
    uses: UsesNode;
    functor: FunctorNode;
};

export class DomainTranslator extends AlchemyNodeTranslator<Domain, DomainTranslatorChildren> {
    translate(node: DomainNode, context: TranslationContext<any>): Domain {
        const { node: domain, context: inner } = context.spawn(Domain, node, (domain) => ({
            qualifier: Qualifier.create(domain, {
                name: node.identifier,
            }),
        }));

        DeclarationRegistry
            .search(context.parentNode)!
            .registerDeclaration(domain);

        domain.uses = this.child.uses(node.uses, inner);
        domain.generics = node.generics.templates.map((g) => this.child.template(g, inner));
        domain.parent = node.parent && this.child.reference(node.parent, inner);

        for (const sub of node.domains.values()) {
            this.child.domain(sub, inner);
        }

        for (const [method, methodNode] of node.methods) {
            domain.functors.set(method, this.child.functor(methodNode, inner));
        }

        domain.intf = this.child.interface(node.interfaced, inner);
        domain.ctor = node.ctor && this.child.functor(node.ctor, inner);

        return domain;
    }
}
