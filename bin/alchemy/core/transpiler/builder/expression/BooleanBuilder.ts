import { BuildInvoker } from '@intent/kernel/transpiler';

import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export interface BooleanChildren extends OperableChildren {
  additive: BuildInvoker<ExpressionNode>;
}

const CMP = ['&', '|', '^'];

export class BooleanBuilder extends OperableBuilder<BooleanChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.additive(tokens);
  }
}
