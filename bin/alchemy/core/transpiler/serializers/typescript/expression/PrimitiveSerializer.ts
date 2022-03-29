import { PrimitiveNode, PrimitiveType } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type PrimitiveSerializerChildren = {
};

export class PrimitiveSerializer extends NodeSerializer<PrimitiveNode, PrimitiveSerializerChildren> {
  serialize(node: PrimitiveNode): string {
    switch (node.type) {
      case PrimitiveType.Number: return node.value;
      case PrimitiveType.String: return node.value;
    }
  }
}
