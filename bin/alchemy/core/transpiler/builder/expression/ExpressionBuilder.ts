import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type ExpressionChildren = {
  boolean: ExpressionNode;
};

export class ExpressionBuilder extends BaseBuilder<ExpressionNode, ExpressionChildren> {
  protected build(tokens, { peek }: TypedTokenMatcherInterface) {
    return this.child.boolean(tokens);
  }
}
