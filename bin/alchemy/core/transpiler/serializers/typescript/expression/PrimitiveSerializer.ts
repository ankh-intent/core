import { LiteralNode, LiteralType } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface PrimitiveSerializerChildren {
}

export class PrimitiveSerializer extends NodeSerializer<LiteralNode, PrimitiveSerializerChildren> {
  serialize(node: LiteralNode): string {
    switch (node.type) {
      case LiteralType.Number: return node.value;
      case LiteralType.String: return node.value;
    }
  }
}
