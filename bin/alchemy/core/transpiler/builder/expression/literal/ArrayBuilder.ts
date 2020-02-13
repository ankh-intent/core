import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../../Alchemy';
import { ArrayNode, ExpressionNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export interface ArrayChildren extends AlchemyBuildInvokers {
  expression: BuildInvoker<ExpressionNode>;
}

export class ArrayBuilder extends BaseBuilder<ArrayNode, ArrayChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const items: ExpressionNode[] = [];

    ensure.symbol('[');

    while (true) {
      if (items.length) {
        ensure.symbol(',');
      }

      const item = this.child.expression(tokens);

      if (item) {
        items.push(item);
      } else {
        break;
      }
    }

    ensure.symbol(']');

    return new ArrayNode(
      items,
    );
  }
}
