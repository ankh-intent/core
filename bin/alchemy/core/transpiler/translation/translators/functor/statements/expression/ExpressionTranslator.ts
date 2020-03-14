import { AbstractNode } from '@intent/kernel';
import { Expression } from '../../../../../../modules/functor/statements/expression';

import { ExpressionNode, OperationNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';

export type ExpressionTranslatorChildren = {
  expression: ExpressionNode;
  // literal: AbstractNode;
  // operation: OperationNode;
};

export class ExpressionTranslator extends NodeTranslator<Expression, ExpressionTranslatorChildren> {
  translate(node: ExpressionNode, c): Expression {
    return Expression.create(node, c.parent, {

    });
    // let code = (
    //   (node.base instanceof ExpressionNode)
    //     ? this.child.expression(node.base, context)
    //     : this.child.literal(node.base, context)
    // );
    //
    // if (node.operations.length) {
    //   for (const operation of node.operations) {
    //     code += (operation.binary ? ' ' : '') + this.child.operation(operation, context);
    //
    //     if (operation.binary) {
    //       code = `(${code})`;
    //     }
    //   }
    // }
    //
    // return code;
  }
}
