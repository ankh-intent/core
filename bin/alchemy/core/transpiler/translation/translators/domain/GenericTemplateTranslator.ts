import { Generic, Domain, Qualifier, DeclarationRegistry } from '../../../../modules';
import { ReferenceNode, GenericTemplateNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type GenericTemplateTranslatorChildren = {
    reference: ReferenceNode;
};

export class GenericTemplateTranslator extends NodeTranslator<Generic, GenericTemplateTranslatorChildren> {
    translate(node: GenericTemplateNode, context: TranslationContext<any>): Generic {
        const { node: generic, context: inner } = context.spawn(Generic, node);

        generic.identifier = node.identifier.name;
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
