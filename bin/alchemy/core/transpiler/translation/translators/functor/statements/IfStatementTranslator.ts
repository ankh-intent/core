import { IfStatement } from '../../../../../modules';
import {
  IfStatementNode,
  BlockNode,
  StatementNode,
} from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type IfStatementTranslatorChildren = {
  block: BlockNode;
  statement: StatementNode;
};

export class IfStatementTranslator extends NodeTranslator<IfStatement, IfStatementTranslatorChildren> {
  translate(node: IfStatementNode, c): IfStatement {
    return IfStatement.create(node, c.parent, {
      condition: this.child.statement(node.condition, c),
      ifTrue: this.child.block(node.ifTrue, c),
      ifFalse: node.ifFalse && this.child.block(node.ifFalse, c),
    });
  }
}
