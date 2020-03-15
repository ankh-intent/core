import { IfStatementNode } from '../../../../transpiler/ast';
import { Block } from './Block';
import { Statement } from './Statement';

export class IfStatement extends Statement<IfStatementNode> {
  public condition: Statement;
  public ifTrue: Block;
  public ifFalse: Block|null = null;

  get isAssertion() {
    return false;
  }

  toString() {
    return `if (${this.condition}) ${this.ifTrue}${this.ifFalse ? ` else ${this.ifFalse}` : ''}`;
  }
}
