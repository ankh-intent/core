import { Strings } from '@intent/utils';
import { BlockNode } from '../../../transpiler/ast';

import { Translated } from '../../Translated';
import { ExpressionStatement } from './ExpressionStatement';
import { ReturnStatement } from './ReturnStatement';
import { Statement } from './Statement';

export class Block extends Translated<BlockNode> {
  public statements: Statement[] = [];

  get isExpressionStatement() {
    return (this.statements.length === 1) && this.statements[0] instanceof ExpressionStatement;
  }

  get isReturnStatement() {
    return (this.statements.length === 1) && this.statements[0] instanceof ReturnStatement;
  }

  toString() {
    if (this.isExpressionStatement) {
      return this.statements.join('\n');
    }

    const code = this.statements
      .map((statement) => statement.isAssertion ? `${statement};` : `${statement}`)
      .join('\n');

    return `{${
      code.trim()
        ? `\n${Strings.indent(code.split('\n'), '  ').join('\n')}\n`
        : ''
    }}`;
  }
}
