import { AbstractNode } from '@intent/kernel';
import { LiteralNode, ObjectNode, ArrayNode, CallableNode, IdentifierNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type LiteralTranslatorChildren = {
  primitive: LiteralNode;
  object_literal: ObjectNode;
  array_literal: ArrayNode;
  callable: CallableNode;
  identifier: IdentifierNode;
};

export class LiteralTranslator extends NodeTranslator<AbstractNode, LiteralTranslatorChildren> {
  translate(node: AbstractNode, context): string {
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
