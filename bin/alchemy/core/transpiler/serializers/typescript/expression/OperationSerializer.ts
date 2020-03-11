import {
  OperationNode,
  CallNode,
  ChainNode,
  IsDomainNode,
  IndexedNode, ExpressionNode,
} from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type OperationSerializerChildren = {
  call: CallNode;
  chain: ChainNode;
  indexed: IndexedNode;
  is_domain: IsDomainNode;
  expression: ExpressionNode;
};

const MAP = {
  '&': '&&',
  '|': '||',
};
const mapOperations = (operation: string) => MAP[operation] || operation;

export class OperationSerializer extends NodeSerializer<OperationNode, OperationSerializerChildren> {
  serialize(node: OperationNode, context): string {
    if (node instanceof CallNode) {
      return this.child.call(node, context);
    } else if (node instanceof ChainNode) {
      return this.child.chain(node, context);
    } else if (node instanceof IsDomainNode) {
      return this.child.is_domain(node, context);
    } else if (node instanceof IndexedNode) {
      return this.child.indexed(node, context);
    } else if (node.right instanceof ExpressionNode) {
      return `${mapOperations(node.operation)} ${this.child.expression(node.right, context)}`;
    }

    throw new Error(`/* unknown operation "${node.node}" */ ${node.astRegion.extract()}`);
  }
}
