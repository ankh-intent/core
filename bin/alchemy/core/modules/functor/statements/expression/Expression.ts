import { ExpressionNode } from '../../../../transpiler/ast';
import { Translated } from '../../../Translated';

export class Expression extends Translated<ExpressionNode> {
  toString() {
    return `expression`;
  }
}
