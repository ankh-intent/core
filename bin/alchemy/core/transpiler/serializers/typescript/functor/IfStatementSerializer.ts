import { IfStatementNode, BlockNode, StatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface IfStatementSerializerChildren {
  block: BlockNode;
  statement: StatementNode;
}

export class IfStatementSerializer extends NodeSerializer<IfStatementNode, IfStatementSerializerChildren> {
  serialize(node: IfStatementNode): string {
    return (
      `if (${this.child.statement(node.condition)}) ${this.child.block(node.ifTrue)}`
      + (node.ifFalse ? ` else ${this.child.block(node.ifFalse)}` : ``)
    );
  }
}
