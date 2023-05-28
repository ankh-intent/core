import { Block } from '../../../../../modules';
import { BlockNode, StatementNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type BlockTranslatorChildren = {
    statement: StatementNode;
};

export class BlockTranslator extends NodeTranslator<Block, BlockTranslatorChildren> {
    translate(node: BlockNode, c): Block {
        return Block.create(node, c.parent, {
            statements: node.statements.map((statement) => this.child.statement(statement, c)),
        });
    }
}
