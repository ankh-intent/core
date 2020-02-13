import { TypedTokenMatcherInterface } from '@intent/parser';

import { BlockNode, StatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type BlockChildren = {
  block_statement: StatementNode;
};

export class BlockBuilder extends BaseBuilder<BlockNode, BlockChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    const statements: StatementNode[] = [];

    ensure.symbol('{');

    while (!peek.symbol('}')) {
      statements.push(this.child.block_statement(tokens));
    }

    ensure.symbol('}');

    return new BlockNode(
      statements,
    );
  }
}
