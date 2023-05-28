import { LoopStatement } from '../../../../../modules';
import { LoopStatementNode, BlockNode, LoopIteratorNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type LoopStatementTranslatorChildren = {
    block: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementTranslator extends NodeTranslator<LoopStatement, LoopStatementTranslatorChildren> {
    translate(node: LoopStatementNode, c): LoopStatement {
        const { node: loop, context } = c.spawn(LoopStatement, node);

        loop.iterator = this.child.loop_iterator(node.iterator, context);
        loop.block = this.child.block(node.block, c);

        return loop;
    }
}
