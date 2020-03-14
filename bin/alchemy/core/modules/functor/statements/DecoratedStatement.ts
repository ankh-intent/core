import { StatementNode } from '../../../transpiler/ast';
import { Expression } from './expression';
import { Statement } from './Statement';

export class DecoratedStatement<N extends StatementNode = StatementNode> extends Statement<N> {
  public decorator: Expression;
  public item: Statement<N>;

  toString() {
    return `@${this.decorator}\n${this.item}`;
  }
}
