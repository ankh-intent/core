import { TranslationContext } from '@intent/translator';
import { LoopStatement } from '@alchemy/modules';
import { LoopStatementNode, BlockNode, LoopIteratorNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type LoopStatementTranslatorChildren = {
    block: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementTranslator extends AlchemyNodeTranslator<LoopStatement, LoopStatementTranslatorChildren> {
    translate(node: LoopStatementNode, context: TranslationContext<any>): LoopStatement {
        const { node: loop, context: inner } = context.spawn(LoopStatement, node);

        loop.iterator = this.child.loop_iterator(node.iterator, inner);
        loop.block = this.child.block(node.block, context);

        return loop;
    }
}
