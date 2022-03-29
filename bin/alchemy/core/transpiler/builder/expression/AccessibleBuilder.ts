import { AbstractNode } from '@intent/kernel';
import { TypedTokenMatcherInterface } from '@intent/parser';

import {
  ExpressionNode,
  ObjectNode,
  PrimitiveNode,
  IdentifierNode,
  ArrayNode,
  CallableNode,
  FunctorArgsNode,
} from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AccessibleChildren = {
  expression: ExpressionNode;
  array: ArrayNode;
  object: ObjectNode;
  literal: PrimitiveNode;
  identifier: IdentifierNode;
  callable: CallableNode;
  functor_args: FunctorArgsNode;
};

export class AccessibleBuilder extends BaseBuilder<AbstractNode, AccessibleChildren> {
  protected build(tokens, { get, ensure, peek }: TypedTokenMatcherInterface) {
    if (peek.symbol('(')) {
      const callable = this.lookup('IS_FUNCTOR', tokens, this.child.callable);

      if (callable) {
        return callable;
      }

      ensure.symbol('(');

      const expression = this.child.expression(tokens);

      ensure.symbol(')');

      return expression;
    } else if (peek.symbol('[')) {
      return this.child.array(tokens);
    } else if (peek.symbol('{')) {
      return this.child.object(tokens);
    }

    const literal = this.child.literal(tokens);

    if (literal) {
      return literal;
    }

    return this.child.identifier(tokens);
  }
}
