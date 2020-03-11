import { IndexedNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type IndexedSerializerChildren = {
  expression: ExpressionNode;
};

export class IndexedSerializer extends NodeSerializer<IndexedNode, IndexedSerializerChildren> {
  serialize(node: IndexedNode, context): string {
    return `[${this.child.expression(node.right, context)}]`;
  }
}
