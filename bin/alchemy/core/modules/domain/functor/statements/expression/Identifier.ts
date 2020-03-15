import { IdentifierNode } from '../../../../../transpiler/ast';
import { Translated } from '../../../../Translated';

export class Identifier extends Translated<IdentifierNode> {
  public name: string;

  toString() {
    return `${this.name}`;
  }
}
