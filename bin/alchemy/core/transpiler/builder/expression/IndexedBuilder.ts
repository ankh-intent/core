import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { ExpressionNode, BinaryOperationNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface IndexedChildren extends AlchemyBuildInvokers {
  expression: BuildInvoker<ExpressionNode>;
}

export class IndexedBuilder extends BaseBuilder<BinaryOperationNode, IndexedChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('[');
    const expression = this.child.expression(tokens);
    ensure.symbol(']');

    return new BinaryOperationNode('[', expression);
  }
}
