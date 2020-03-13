import { LoopStatementNode, BlockNode, LoopIteratorNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type LoopStatementTranslatorChildren = {
  block: BlockNode;
  loop_iterator: LoopIteratorNode;
};

export class LoopStatementTranslator extends NodeTranslator<LoopStatementNode, LoopStatementTranslatorChildren> {
  translate(node: LoopStatementNode, context): string {
    const sub = context.nest();

    return `\nfor (${this.child.loop_iterator(node.iterator, sub)}) ${this.child.block(node.block, sub)}`
  }
}
