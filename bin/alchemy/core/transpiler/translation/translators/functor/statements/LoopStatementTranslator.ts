import { LoopStatement } from '../../../../../modules';
import { LoopStatementNode, BlockNode, LoopIteratorNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type LoopStatementTranslatorChildren = {
    block: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementTranslator extends NodeTranslator<LoopStatement, LoopStatementTranslatorChildren> {
    translate(node: LoopStatementNode, context: TranslationContext<any>): LoopStatement {
        const { node: loop, context: inner } = context.spawn(LoopStatement, node);

        loop.iterator = this.child.loop_iterator(node.iterator, inner);
        loop.block = this.child.block(node.block, context);

        return loop;
    }
}
