import { ReturnStatementNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type ReturnStatementTranslatorChildren = {
  expression: ExpressionNode;
};

export class ReturnStatementTranslator extends NodeTranslator<ReturnStatementNode, ReturnStatementTranslatorChildren> {
  translate(node: ReturnStatementNode, context): string {
    return `return${node.expression ? ' ' + this.child.expression(node.expression, context) : ''}`;
  }
}
