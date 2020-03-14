import { Strings } from '@intent/utils';
import { BlockNode, ExpressionStatementNode, ReturnStatementNode } from '../../../transpiler/ast';
import { Translated } from '../../Translated';
import { Statement } from './Statement';

export class Block extends Translated<BlockNode> {
  public statements: Statement[] = [];

  get isExpressionStatement() {
    return (this.statements.length === 1) && this.statements[0].ast instanceof ExpressionStatementNode;
  }

  get isReturnStatement() {
    return (this.statements.length === 1) && this.statements[0].ast instanceof ReturnStatementNode;
  }

  toString() {
    const code = Strings.indent(this.statements.join('\n').split('\n'), '  ').join('\n');

    return this.isExpressionStatement ? code : `{${
      code.trim()
        ? `\n${code}\n`
        : code
    }}`;
  }
}
