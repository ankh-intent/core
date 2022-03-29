import { DomainReference, DeclarationRegistry } from '../../../../modules';
import { ReferenceNode, QualifierNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type DomainReferenceTranslatorChildren = {
  reference: ReferenceNode;
  qualifier: QualifierNode;
};

export class DomainReferenceTranslator extends NodeTranslator<DomainReference, DomainReferenceTranslatorChildren> {
  translate(node: ReferenceNode, c): DomainReference {
    const { node: reference, context } = c.spawn(DomainReference, node);

    reference.qualifier = this.child.qualifier(node.qualifier, context);
    reference.generics = node.generic?.genericTypes.map((g) => this.child.reference(g, context)) || [];
    reference.domain = DeclarationRegistry.search(reference)!.getDeclaration(node.qualifier);

    return reference;
  }
}
