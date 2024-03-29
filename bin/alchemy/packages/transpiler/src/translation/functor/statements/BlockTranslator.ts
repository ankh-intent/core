import { Block } from '@alchemy/modules';
import { BlockNode, StatementNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';
import { TranslationContext } from '@intent/translator';

export type BlockTranslatorChildren = {
    statement: StatementNode;
};

export class BlockTranslator extends AlchemyNodeTranslator<Block, BlockTranslatorChildren> {
    translate(node: BlockNode, context: TranslationContext<any>): Block {
        return Block.create(node, context.parentNode, {
            statements: node.statements.map((statement) => this.child.statement(statement, context)),
        });
    }
}
