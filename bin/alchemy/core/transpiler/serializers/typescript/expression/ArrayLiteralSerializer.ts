import { ArrayNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ArrayLiteralSerializerChildren {
  expression: ExpressionNode;
}

export class ArrayLiteralSerializer extends NodeSerializer<ArrayNode, ArrayLiteralSerializerChildren> {
  serialize(node: ArrayNode): string {
    return `[${this.wrapInlineList(node.items.map(this.child.expression))}]`
  }
}
