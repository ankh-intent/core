import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type ComparisionChildren = OperableChildren & {
  boolean: ExpressionNode;
};

const CMP = ['>', '<', '>=', '<=', '!=', '=='];

export class ComparisionBuilder extends OperableBuilder<ComparisionChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.boolean(tokens);
  }
}
