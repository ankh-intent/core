import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { ExpressionNode, ObjectNode, LiteralNode, IdentifierNode, ArrayNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface AccessorChildren extends AlchemyBuildInvokers {
  expression: BuildInvoker<ExpressionNode>;
  array: BuildInvoker<ArrayNode>;
  object: BuildInvoker<ObjectNode>;
  literal: BuildInvoker<LiteralNode>;
  identifier: BuildInvoker<IdentifierNode>;
}

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
