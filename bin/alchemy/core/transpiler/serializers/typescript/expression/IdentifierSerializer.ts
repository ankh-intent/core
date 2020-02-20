import { IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IdentifierSerializerChildren {
}

export class IdentifierSerializer extends NodeSerializer<IdentifierNode, IdentifierSerializerChildren> {
  serialize(node: IdentifierNode): string {
    return `${node.name}`; // todo: identifiers access
  }
}
