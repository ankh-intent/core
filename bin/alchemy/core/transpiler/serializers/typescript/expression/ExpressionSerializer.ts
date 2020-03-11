import { AbstractNode } from '@intent/kernel';

import { ExpressionNode, OperationNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ExpressionSerializerChildren = {
  expression: ExpressionNode;
  literal: AbstractNode;
  operation: OperationNode;
};

export class ExpressionSerializer extends NodeSerializer<ExpressionNode, ExpressionSerializerChildren> {
  serialize(node: ExpressionNode, context): string {
    let code = (
      (node.base instanceof ExpressionNode)
        ? this.child.expression(node.base, context)
        : this.child.literal(node.base, context)
    );

    if (node.operations.length) {
      for (const operation of node.operations) {
        code += (operation.binary ? ' ' : '') + this.child.operation(operation, context);

        if (operation.binary) {
          code = `(${code})`;
        }
      }
    }

    return code;
  }
}
