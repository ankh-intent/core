import { IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IdentifierSerializerChildren {
}

export class IdentifierSerializer extends NodeSerializer<IdentifierNode, IdentifierSerializerChildren> {
  serialize(node: IdentifierNode, context): string {
    return context.getLocalIdentifier(node.name) || `/* unknown */ ${node.name}`;
  }
}
