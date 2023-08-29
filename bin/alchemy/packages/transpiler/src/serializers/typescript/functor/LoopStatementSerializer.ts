import { LoopStatementNode, BlockNode, LoopIteratorNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type LoopStatementSerializerChildren = {
    block: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementSerializer extends NodeSerializer<LoopStatementNode, LoopStatementSerializerChildren> {
    serialize(node: LoopStatementNode, context: SerializingContext): string {
        const sub = context.nest();

        return `\nfor (${this.child.loop_iterator(node.iterator, sub)}) ${this.child.block(node.block, sub)}`;
    }
}
