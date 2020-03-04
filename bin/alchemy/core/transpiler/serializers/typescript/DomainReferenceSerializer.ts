import { TypeNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainReferenceSerializerChildren {
  type: TypeNode;
}

export class DomainReferenceSerializer extends NodeSerializer<TypeNode, DomainReferenceSerializerChildren> {
  serialize(node: TypeNode, context): string {
    return `${node.isArray ? 'Array<' : ''}${node.qualifier.path()}${this.serializeGeneric(node, context)}${node.isArray ? '>' : ''}`;
  }

  serializeGeneric(node: TypeNode, context) {
    return (
      (node.generic && node.generic.genericTypes.length)
        ? `<${this.wrapInlineList(node.generic.genericTypes.map((child) => this.child.type(child, context)))}>`
        : ''
    );
  }
}
