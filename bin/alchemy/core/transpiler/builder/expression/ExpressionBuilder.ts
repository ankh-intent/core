import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionNode, BinaryOperationNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type ExpressionChildren = {
  comparision: ExpressionNode;
  chain: BinaryOperationNode;
  indexed: BinaryOperationNode;
  call: BinaryOperationNode;
  is_domain: BinaryOperationNode;
};

export class ExpressionBuilder extends BaseBuilder<ExpressionNode, ExpressionChildren> {
  protected build(tokens, { peek }: TypedTokenMatcherInterface) {
    const base = this.child.comparision(tokens);
    const operations: BinaryOperationNode[] = [];

    while (true) {
      if (peek.symbol('.')) {
        operations.push(this.child.chain(tokens));
      } else if (peek.symbol('[')) {
        operations.push(this.child.indexed(tokens));
      } else if (peek.symbol('(')) {
        operations.push(this.child.call(tokens));
      } else if (peek.identifier('is')) {
        operations.push(this.child.is_domain(tokens));
      } else {
        break;
      }
    }

    if (operations.length) {
      return new ExpressionNode(
        base,
        operations,
      );
    }

    return base;
  }
}
