import { BuildInvoker } from '@intent/kernel/transpiler';

import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export interface AdditiveChildren extends OperableChildren {
  multiplicative: BuildInvoker<ExpressionNode>;
}

const CMP = ['+', '-'];

export class AdditiveBuilder extends OperableBuilder<AdditiveChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.multiplicative(tokens);
  }
}
