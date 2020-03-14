import { AssignmentStatementNode } from '../../../transpiler/ast';
import { Translated } from '../../Translated';
import { AssignmentTarget } from './AssignmentTarget';
import { Expression } from './expression';
import { Statement } from './Statement';

export class AssignmentStatement<N extends Translated<any> = Translated<any>> extends Statement<AssignmentStatementNode> {
  public target: AssignmentTarget<N>;
  public operator: string;
  public expression: Expression;

  isDeclaration(): this is AssignmentStatement<any>  {
    return this.target.isDeclaration();
  }

  // get targetBase(): N {
  //   return this.target.target.base;
  // }

  toString() {
    return `${this.target} ${this.operator} ${this.expression}`;
  }
}
