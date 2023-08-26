import { Block } from '@alchemy/modules';
import { BlockNode, StatementNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type BlockTranslatorChildren = {
    statement: StatementNode;
};

export class BlockTranslator extends NodeTranslator<Block, BlockTranslatorChildren> {
    translate(node: BlockNode, context: TranslationContext<any>): Block {
        return Block.create(node, context.parent, {
            statements: node.statements.map((statement) => this.child.statement(statement, context)),
        });
    }
}
