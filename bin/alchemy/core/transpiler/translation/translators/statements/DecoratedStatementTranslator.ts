import { StatementNode, DecoratedStatementNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type DecoratedStatementTranslatorChildren = {
  statement: StatementNode;
  expression: ExpressionNode;
};

export class DecoratedStatementTranslator extends NodeTranslator<DecoratedStatementNode, DecoratedStatementTranslatorChildren> {
  translate(node: DecoratedStatementNode, context): string {
    return this.wrapStatements([
      `@${this.child.expression(node.decorator, context)}`,
      this.child.statement(node.item, context),
    ]);
  }
}
