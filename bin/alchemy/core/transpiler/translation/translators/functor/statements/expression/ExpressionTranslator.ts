import { AbstractNode } from '@intent/kernel';
import { Expression } from '../../../../../../modules/domain/functor/statements/expression';

import { ExpressionNode, OperationNode, UnaryNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type ExpressionTranslatorChildren = {
  expression: ExpressionNode;
  literal: AbstractNode;
  operation: OperationNode;
  unary: UnaryNode;
};

export class ExpressionTranslator extends NodeTranslator<Expression, ExpressionTranslatorChildren> {
  translate(node: ExpressionNode, c): Expression {
    if (node instanceof UnaryNode) {
      return this.child.unary(node, c);
    }

    const base = (
      (node.base instanceof ExpressionNode)
        ? this.child.expression(node.base, c)
        : this.child.literal(node.base, c)
    );

    return Expression.create(node, c.parent, {
      base,
      operations: node.operations.map((operation) => this.child.operation(operation, c)),
    });
  }
}
