import { AssignmentTargetNode } from '../../../transpiler/ast';
import { Translated } from '../../Translated';
import { Expression } from './expression';

export class AssignmentTarget<N extends Translated<any>> extends Translated<AssignmentTargetNode> {
  public target: Expression;
  public _isDeclaration: boolean = true;

  isDeclaration(): this is AssignmentTarget<any>  {
    return this._isDeclaration;
  }

  toString() {
    return `${this._isDeclaration ? 'let ' : ''}${this.target}`;
  }
}
