import { ReturnStatementNode } from '../../../../transpiler/ast';
import { Expression } from './expression';
import { Statement } from './Statement';

export class ReturnStatement extends Statement<ReturnStatementNode> {
  public expression: Expression|null = null;

  toString() {
    return `return${this.expression ? ` ${this.expression}` : ''}`;
  }
}
