import { AbstractNode } from '@intent/kernel';
import { ExpressionNode } from './ExpressionNode';

export class CallArgNode extends AbstractNode {
  constructor(
    public identifier: string|null,
    public expression: ExpressionNode,
  ) {
    super();
  }
}
