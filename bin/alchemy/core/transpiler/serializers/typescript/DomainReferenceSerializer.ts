import { TypeNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainReferenceSerializerChildren {
  type: TypeNode;
}

export class DomainReferenceSerializer extends NodeSerializer<TypeNode, DomainReferenceSerializerChildren> {
  serialize(node: TypeNode): string {
    return `${node.isArray ? 'Array<' : ''}${node.qualifier.path()}${this.serializeGeneric(node)}${node.isArray ? '>' : ''}`;
  }

  serializeGeneric(node: TypeNode) {
    return (
      (node.generic && node.generic.genericTypes.length)
        ? `<${this.wrapInlineList(node.generic.genericTypes.map((child) => this.child.type(child)))}>`
        : ''
    );
  }
}
