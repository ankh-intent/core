import { LoopStatementNode, BlockNode, LoopIteratorNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface LoopStatementSerializerChildren {
  block: BlockNode;
  loop_iterator: LoopIteratorNode;
}

export class LoopStatementSerializer extends NodeSerializer<LoopStatementNode, LoopStatementSerializerChildren> {
  serialize(node: LoopStatementNode): string {
    return `each (${this.child.loop_iterator(node.iterator)}) ${this.child.block(node.block)}`
  }
}
