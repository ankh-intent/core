import { BlockNode, StatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type BlockSerializerChildren = {
  statement: StatementNode;
};

export class BlockSerializer extends NodeSerializer<BlockNode, BlockSerializerChildren> {
  serialize(node: BlockNode, context): string {
    const sub = context.nest();
    const cap = !node.isExpressionStatement;
    const statements = node.statements
      .map((statement) => this.child.statement(statement, sub) + (cap && statement.isAssertion ? ';' : ''));

    if (node.isExpressionStatement) {
      return this.wrapStatements(statements);
    }

    return `{${this.wrap(statements)}}`;
  }
}
