import { FunctorArgsNode } from '../../transpiler/ast';
import { Translated } from '../Translated';
import { FunctorArg } from './FunctorArg';

export class FunctorArgs extends Translated<FunctorArgsNode> {
  public args: FunctorArg[] = [];

  toString() {
    return `${this.args.join(', ')}`;
  }
}
