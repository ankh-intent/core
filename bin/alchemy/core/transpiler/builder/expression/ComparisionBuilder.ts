import { BuildInvoker } from '@intent/kernel/transpiler';

import { ExpressionNode } from '../../ast';
import { OperableBuilder, OperableChildren } from './OperableBuilder';

export interface ComparisionChildren extends OperableChildren {
  boolean: BuildInvoker<ExpressionNode>;
}

const CMP = ['>', '<', '>=', '<=', '!=', '=='];

export class ComparisionBuilder extends OperableBuilder<ComparisionChildren> {
  operands = CMP;

  protected buildBase(tokens): ExpressionNode {
    return this.child.boolean(tokens);
  }
}
