import { BlockNode, StatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface BlockSerializerChildren {
  statement: StatementNode;
}

export class BlockSerializer extends NodeSerializer<BlockNode, BlockSerializerChildren> {
  serialize(node: BlockNode): string {
    return `{${this.wrap(node.statements.map((statement) => this.child.statement(statement)))}}`;
  }
}
