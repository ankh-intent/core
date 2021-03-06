import { Container } from '@intent/utils';
import { TreeNode } from '@intent/kernel/ast';
import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { BinaryOperationNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type OperableChildren = {
  expression: ExpressionNode;
}

export abstract class OperableBuilder<C extends Container<TreeNode>> extends BaseBuilder<ExpressionNode, C & OperableChildren> {
  operands: string[];

  protected abstract buildBase(tokens: TokenMatcher): ExpressionNode;

  protected build(tokens, { peek, get }: TypedTokenMatcherInterface) {
    const base = this.buildBase(tokens);
    const operations: BinaryOperationNode[] = [];
    let operation: string|null;

    while ((operation = peek.symbol()) && this.operands.includes(operation)) {
      get.any();

      const expression = this.child.expression(tokens);

      operations.push(new BinaryOperationNode(
        operation,
        expression,
      ));
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
