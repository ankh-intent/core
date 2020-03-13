import { BlockNode, StatementNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type BlockTranslatorChildren = {
  statement: StatementNode;
};

export class BlockTranslator extends NodeTranslator<BlockNode, BlockTranslatorChildren> {
  translate(node: BlockNode, context): string {
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
