import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export type MultiplicativeChildren = OperableChildren & {
  accessor: ExpressionNode;
};

const CMP = ['*', '/', '%', '**'];

export class MultiplicativeBuilder extends OperableBuilder<MultiplicativeChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.accessor(tokens);
  }
}
