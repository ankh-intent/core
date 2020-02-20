import { IndexedNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IndexedSerializerChildren {
  expression: ExpressionNode;
}

export class IndexedSerializer extends NodeSerializer<IndexedNode, IndexedSerializerChildren> {
  serialize(node: IndexedNode): string {
    return `[${this.child.expression(node.right)}]`;
  }
}
