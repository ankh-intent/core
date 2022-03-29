import { CallArgNode } from '../../../../../../transpiler/ast';
import { Translated } from '../../../../../Translated';
import { Expression } from '../Expression';

export class CallArg extends Translated<CallArgNode> {
  public identifier: string|null;
  public expression: Expression;

  toString(): string {
    return `${this.identifier ? `${this.identifier}: ` : ''}${this.expression}`;
  }
}
