import { ExpressionNode, ExpressionStatementNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type ExpressionStatementTranslatorChildren = {
  expression: ExpressionNode;
};

export class ExpressionStatementTranslator extends NodeTranslator<ExpressionStatementNode, ExpressionStatementTranslatorChildren> {
  translate(node: ExpressionStatementNode, context): string {
    return this.child.expression(node.expression, context);
  }
}
