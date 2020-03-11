import { IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type IdentifierSerializerChildren = {
};

export class IdentifierSerializer extends NodeSerializer<IdentifierNode, IdentifierSerializerChildren> {
  serialize(node: IdentifierNode, context): string {
    return context.getLocalIdentifier(node.name) || `/* unknown */ ${node.name}`;
  }
}
