import { Unary } from '../../../../../../../modules';
import { UnaryNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';

export type UnaryTranslatorChildren = {
  expression: ExpressionNode;
};

export class UnaryTranslator extends NodeTranslator<Unary, UnaryTranslatorChildren> {
  translate(node: UnaryNode, c): Unary {
    return Unary.create(node, c.parent, {
      operation: node.operation,
      base: this.child.expression(node.base, c),
    });
  }
}
