import { LoopStatementNode, BlockNode, LoopIteratorNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface LoopStatementSerializerChildren {
  block: BlockNode;
  loop_iterator: LoopIteratorNode;
}

export class LoopStatementSerializer extends NodeSerializer<LoopStatementNode, LoopStatementSerializerChildren> {
  serialize(node: LoopStatementNode, context): string {
    const sub = context.nest();

    return `\nfor (${this.child.loop_iterator(node.iterator, sub)}) ${this.child.block(node.block, sub)}`
  }
}
