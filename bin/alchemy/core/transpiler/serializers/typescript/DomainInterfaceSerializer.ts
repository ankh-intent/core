import { TypeNode } from '../../ast';
import { NodeSerializer } from '../NodeSerializer';

export interface DomainInterfaceSerializerChildren {
  type: TypeNode;
}

export class DomainInterfaceSerializer extends NodeSerializer<TypeNode, DomainInterfaceSerializerChildren> {
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
