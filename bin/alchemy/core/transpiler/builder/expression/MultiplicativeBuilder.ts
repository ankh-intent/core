import { BuildInvoker } from '@intent/kernel/transpiler';

import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export interface MultiplicativeChildren extends OperableChildren {
  accessor: BuildInvoker<ExpressionNode>;
}

const CMP = ['*', '/', '%', '**'];

export class MultiplicativeBuilder extends OperableBuilder<MultiplicativeChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.accessor(tokens);
  }
}
