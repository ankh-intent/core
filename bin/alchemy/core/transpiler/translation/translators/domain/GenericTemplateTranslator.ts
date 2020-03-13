import { Generic, Domain, Qualifier, DomainRegistry } from '../../../../modules';
import { ReferenceNode, GenericTemplateNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type GenericTemplateTranslatorChildren = {
  reference: ReferenceNode;
};

export class GenericTemplateTranslator extends NodeTranslator<Generic, GenericTemplateTranslatorChildren> {
  translate(node: GenericTemplateNode, c): Generic {
    const { node: generic, context } = c.spawn(Generic, node);

    generic.identifier = node.identifier.name;
    generic.domain = Domain.create(generic, (domain) => ({
      qualifier: Qualifier.create(domain, {
        name: generic.identifier,
      }),
      parent: node.parent && this.child.reference(node.parent, context),
    }));
    generic.defaultsTo = node.def && this.child.reference(node.def, context);

    DomainRegistry.search(generic)!.registerDomain(generic.domain);

    return generic;
  }
}
