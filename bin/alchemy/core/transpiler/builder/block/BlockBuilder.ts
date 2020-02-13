import { TypedTokenMatcherInterface } from '@intent/parser';

import { BlockNode, StatementNode, DecoratedStatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockChildren = {
  block_item: StatementNode;
  decorated_statement: DecoratedStatementNode;
};

export class BlockBuilder extends BaseBuilder<BlockNode, BlockChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    const statements: StatementNode[] = [];

    ensure.symbol('{');

    while (!peek.symbol('}')) {
      if (peek.symbol('@')) {
        statements.push(this.child.decorated_statement(tokens));
      } else {
        statements.push(this.child.block_item(tokens));
      }
    }

    ensure.symbol('}');

    return new BlockNode(
      statements,
    );
  }
}
