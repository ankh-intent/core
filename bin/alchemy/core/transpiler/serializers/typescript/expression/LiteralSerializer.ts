import { AbstractNode } from '@intent/kernel';
import { LiteralNode, ObjectNode, ArrayNode, CallableNode, IdentifierNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface LiteralSerializerChildren {
  primitive: LiteralNode;
  object_literal: ObjectNode;
  array_literal: ArrayNode;
  callable: CallableNode;
  identifier: IdentifierNode;
}

export class LiteralSerializer extends NodeSerializer<AbstractNode, LiteralSerializerChildren> {
  serialize(node: AbstractNode, context): string {
    if (node instanceof LiteralNode) {
      return this.child.primitive(node, context);
    } else if (node instanceof ObjectNode) {
      return this.child.object_literal(node, context);
    } else if (node instanceof ArrayNode) {
      return this.child.array_literal(node, context);
    } else if (node instanceof CallableNode) {
      return this.child.callable(node, context);
    } else if (node instanceof IdentifierNode) {
      return this.child.identifier(node, context);
    }

    return `/* unknown literal "${node.node}" */ ${node.astRegion.extract()}`;
  }
}
