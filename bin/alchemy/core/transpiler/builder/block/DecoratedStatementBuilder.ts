import { TypedTokenMatcherInterface } from '@intent/parser';

import { DecoratedStatementNode, ExpressionNode, StatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type DecoratedStatementChildren = {
  expression: ExpressionNode;
  block_item: StatementNode;
};

export class DecoratedStatementBuilder extends BaseBuilder<StatementNode, DecoratedStatementChildren> {
  protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('@');

    const decorator = this.child.expression(tokens);
    const item = this.child.block_item(tokens);

    return new DecoratedStatementNode(
      decorator,
      item,
    );
  }
}
