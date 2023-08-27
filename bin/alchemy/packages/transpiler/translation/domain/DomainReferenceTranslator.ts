import { TranslationContext } from '@intent/translator';
import { DomainReference, DeclarationRegistry, DomainInterface } from '@alchemy/modules';
import { ReferenceNode, QualifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DomainReferenceTranslatorChildren = {
    reference: ReferenceNode;
    qualifier: QualifierNode;
};

export class DomainReferenceTranslator extends AlchemyNodeTranslator<DomainReference, DomainReferenceTranslatorChildren> {
    translate(node: ReferenceNode, context: TranslationContext<any>): DomainReference {
        const { node: reference, context: inner } = context.spawn(DomainReference, node);

        reference.qualifier = this.child.qualifier(node.qualifier, inner);
        reference.generics = node.generic?.genericTypes.map((g) => this.child.reference(g, inner)) || [];
        reference.domain = DeclarationRegistry.search(reference)!.getDeclaration<DomainInterface>(node.qualifier);

        return reference;
    }
}
