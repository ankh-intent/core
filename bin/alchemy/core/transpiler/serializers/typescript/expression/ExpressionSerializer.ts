import { AbstractNode } from '@intent/kernel';

import { ExpressionNode, BinaryOperationNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ExpressionSerializerChildren {
  expression: ExpressionNode;
  literal: AbstractNode;
  operation: BinaryOperationNode;
}

export class ExpressionSerializer extends NodeSerializer<ExpressionNode, ExpressionSerializerChildren> {
  serialize(node: ExpressionNode, context): string {
    let code = (
      (node.base instanceof ExpressionNode)
        ? this.child.expression(node.base, context)
        : this.child.literal(node.base, context)
    );

    if (node.operations.length) {
      code = `(${code})`;

      for (const operation of node.operations) {
        code += this.child.operation(operation, context);
      }
    }

    return code;
  }
}
