import { AbstractNode } from '@intent/kernel/ast';
import { ExpressionNode, BinaryOperationNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ExpressionSerializerChildren {
  expression: ExpressionNode;
  literal: AbstractNode;
  operation: BinaryOperationNode;
}

export class ExpressionSerializer extends NodeSerializer<ExpressionNode, ExpressionSerializerChildren> {
  serialize(node: ExpressionNode): string {
    let code = (
      (node.base instanceof ExpressionNode)
        ? this.child.expression(node.base)
        : this.child.literal(node.base)
    );

    if (node.operations.length) {
      code = `(${code})`;

      for (const operation of node.operations) {
        code += this.child.operation(operation);
      }
    }

    return code;
  }
}
