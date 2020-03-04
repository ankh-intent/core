import { CallArgNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface CallArgSerializerChildren {
  expression: ExpressionNode;
}

export class CallArgSerializer extends NodeSerializer<CallArgNode, CallArgSerializerChildren> {
  serialize(node: CallArgNode, context): string {
    return `/* ${node.identifier}: */ ${this.child.expression(node.expression, context)}`;
  }
}
