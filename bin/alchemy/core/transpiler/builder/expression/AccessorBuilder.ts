import { AbstractNode } from '@intent/kernel/ast';
import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionNode, BinaryOperationNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AccessorChildren = {
  accessible: AbstractNode;
  chain: BinaryOperationNode;
  indexed: BinaryOperationNode;
  call: BinaryOperationNode;
  is_domain: BinaryOperationNode;
};

export class AccessorBuilder extends BaseBuilder<ExpressionNode, AccessorChildren> {
  protected build(tokens, { get, ensure, peek }: TypedTokenMatcherInterface) {
    const base = this.child.accessible(tokens);
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

    return new ExpressionNode(
      base,
      operations,
    );
  }
}
