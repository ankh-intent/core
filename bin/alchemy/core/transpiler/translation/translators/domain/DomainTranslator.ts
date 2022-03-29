import {
  DomainNode,
  FunctorNode,
  UsesNode,
  ReferenceNode,
  GenericTemplateNode,
  DomainInterfaceNode,
} from '../../../ast';
import { Domain, DeclarationRegistry, Qualifier } from '../../../../modules';
import { NodeTranslator } from '../../NodeTranslator';

export type DomainTranslatorChildren = {
  reference: ReferenceNode;
  template: GenericTemplateNode;
  interface: DomainInterfaceNode;
  domain: DomainNode;
  uses: UsesNode;
  functor: FunctorNode;
};

export class DomainTranslator extends NodeTranslator<Domain, DomainTranslatorChildren> {
  translate(node: DomainNode, c): Domain {
    const { node: domain, context } = c.spawn(Domain, node, (domain) => ({
      qualifier: Qualifier.create(domain, {
        name: node.identifier,
      }),
    }));

    DeclarationRegistry
      .search(c.parent)!
      .registerDeclaration(domain);

    domain.uses = this.child.uses(node.uses, context);
    domain.generics = node.generics.templates.map((g) => this.child.template(g, context));
    domain.parent = node.parent && this.child.reference(node.parent, context);

    for (const sub of node.domains.values()) {
      this.child.domain(sub, context);
    }

    for (const [method, methodNode] of node.methods) {
      domain.functors.set(method, this.child.functor(methodNode, context));
    }

    domain.intf = this.child.interface(node.intf, context);
    domain.ctor = node.ctor && this.child.functor(node.ctor, context);

    return domain;
  }
}
