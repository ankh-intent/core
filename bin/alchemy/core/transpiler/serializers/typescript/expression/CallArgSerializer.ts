import { CallNode, CallArgNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface CallArgSerializerChildren {
  expression: ExpressionNode;
}

export class CallArgSerializer extends NodeSerializer<CallArgNode, CallArgSerializerChildren> {
  serialize(node: CallArgNode): string {
    return `/* ${node.identifier}: */ ${this.child.expression(node.expression as ExpressionNode)}`;
  }
}
