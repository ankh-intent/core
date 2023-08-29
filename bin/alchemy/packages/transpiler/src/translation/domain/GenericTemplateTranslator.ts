import { TranslationContext } from '@intent/translator';
import { Generic, Domain, Qualifier, DeclarationRegistry, DomainModifier, Interface } from '@alchemy/modules';
import { ReferenceNode, GenericTemplateNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type GenericTemplateTranslatorChildren = {
    reference: ReferenceNode;
};

export class GenericTemplateTranslator extends AlchemyNodeTranslator<Generic, GenericTemplateTranslatorChildren> {
    translate(node: GenericTemplateNode, context: TranslationContext<any>): Generic {
        const { node: generic, context: inner } = context.spawn(Generic, node, {
            identifier: node.identifier.name,
        });

        generic.domain = Domain.create(generic, (domain) => ({
            qualifier: Qualifier.create(domain, {
                name: generic.identifier,
            }),
            parent: node.parent && this.child.reference(node.parent, inner),
        }));
        generic.defaultsTo = node.def && this.child.reference(node.def, inner);

        DeclarationRegistry.search(generic)!.registerDeclaration(generic.domain);

        return generic;
    }
}
