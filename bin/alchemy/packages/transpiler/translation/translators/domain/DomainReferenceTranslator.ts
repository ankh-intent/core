import { DomainReference, DeclarationRegistry, DomainInterface } from '@alchemy/modules';
import { ReferenceNode, QualifierNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type DomainReferenceTranslatorChildren = {
    reference: ReferenceNode;
    qualifier: QualifierNode;
};

export class DomainReferenceTranslator extends NodeTranslator<DomainReference, DomainReferenceTranslatorChildren> {
    translate(node: ReferenceNode, context: TranslationContext<any>): DomainReference {
        const { node: reference, context: inner } = context.spawn(DomainReference, node);

        reference.qualifier = this.child.qualifier(node.qualifier, inner);
        reference.generics = node.generic?.genericTypes.map((g) => this.child.reference(g, inner)) || [];
        reference.domain = DeclarationRegistry.search(reference)!.getDeclaration<DomainInterface>(node.qualifier);

        return reference;
    }
}
