import {
  IfStatementNode,
  BlockNode,
  StatementNode,
  AssignmentStatementNode,
  ExpressionNode,
  IdentifierNode,
} from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type IfStatementTranslatorChildren = {
  block: BlockNode;
  statement: StatementNode;
  identifier: IdentifierNode;
  expression: ExpressionNode;
};

export class IfStatementTranslator extends NodeTranslator<IfStatementNode, IfStatementTranslatorChildren> {
  translate(node: IfStatementNode, context): string {
    const sub = context.nest();
    const condition = this.child.statement(node.condition, sub);
    const ifTrue = this.child.block(node.ifTrue, sub);
    const ifFalse = node.ifFalse && this.child.block(node.ifFalse, sub);
    const body = ifTrue + (ifFalse ? ` else ${ifFalse}` : '');

    if (node.condition instanceof AssignmentStatementNode && node.condition.isDeclaration()) {
      return `{${this.wrap([
        condition + ';',
        '',
        `if (${this.child.identifier(node.condition.targetBase, sub)}) ${body}`,
      ])}}`;
    }

    return this.wrap([
      '',
      `if (${condition}) ${body}`,
      '',
    ]);
  }
}
