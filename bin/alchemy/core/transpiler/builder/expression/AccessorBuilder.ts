import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionNode, ObjectNode, LiteralNode, IdentifierNode, ArrayNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AccessorChildren = {
  expression: ExpressionNode;
  array: ArrayNode;
  object: ObjectNode;
  literal: LiteralNode;
  identifier: IdentifierNode;
};

export class AccessorBuilder extends BaseBuilder<ExpressionNode, AccessorChildren> {
  protected build(tokens, { get, ensure, peek }: TypedTokenMatcherInterface) {
    if (get.symbol('(')) {
      const expression = this.child.expression(tokens);

      ensure.symbol(')');

      return expression;
    } else if (peek.symbol('[')) {
      return new ExpressionNode(this.child.array(tokens));
    } else if (peek.symbol('{')) {
      return new ExpressionNode(this.child.object(tokens));
    }

    const literal = this.child.literal(tokens);

    if (literal) {
      return new ExpressionNode(literal);
    }

    const identifier = this.child.identifier(tokens);

    return new ExpressionNode(
      identifier,
    );
  }
}
