import {
  BinaryOperationNode,
  CallNode,
  ChainNode,
  IsDomainNode,
  IndexedNode, ExpressionNode,
} from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface OperationSerializerChildren {
  call: CallNode;
  chain: ChainNode;
  indexed: IndexedNode;
  is_domain: IsDomainNode;
  expression: ExpressionNode;
}

export class OperationSerializer extends NodeSerializer<BinaryOperationNode, OperationSerializerChildren> {
  serialize(node: BinaryOperationNode, context): string {
    if (node instanceof CallNode) {
      return this.child.call(node, context);
    } else if (node instanceof ChainNode) {
      return this.child.chain(node, context);
    } else if (node instanceof IsDomainNode) {
      return this.child.is_domain(node, context);
    } else if (node instanceof IndexedNode) {
      return this.child.indexed(node, context);
    } else if (node.right instanceof ExpressionNode) {
      return `${node.operation} (${this.child.expression(node.right, context)})`;
    }

    throw new Error(`/* unknown operation "${node.node}" */ ${node.astRegion.extract()}`);
  }
}
