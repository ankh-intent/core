import { LoopIteratorNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface LoopIteratorSerializerChildren {
  expression: ExpressionNode;
}

export class LoopIteratorSerializer extends NodeSerializer<LoopIteratorNode, LoopIteratorSerializerChildren> {
  serialize(node: LoopIteratorNode, context): string {
    return `let ${this.child.expression(node.target.target, context)} of ${this.child.expression(node.iterable, context)}`;
  }
}
