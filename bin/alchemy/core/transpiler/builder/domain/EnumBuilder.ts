import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, EnumNode, ExpressionNode, QualifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type EnumChildren = {
  type: TypeNode;
  qualifier: QualifierNode;
  expression: ExpressionNode;
};

export class EnumBuilder extends BaseBuilder<EnumNode, EnumChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    if (not.identifier('enum')) {
      return null;
    }

    const identifier = ensure.identifier();
    const parent: TypeNode|null = get.identifier('extends')
      ? this.child.type(tokens)
      : null;


    ensure.symbol('{');

    const values = new Map<QualifierNode, ExpressionNode>();

    while (true) {
      const inherit = get.symbol(':');

      if (!peek.identifier()) {
        if (inherit) {
          throw this.error(tokens, 'qualifier', `Expected enum name qualifier`)
        }

        break;
      }

      const value = this.child.qualifier(tokens);

      if ([...values.keys()].find(q => q.path() === value.path())) {
        throw this.error(tokens, '@identifier()', `Enum value with the same name "${value.path()}" already present`);
      }

      ensure.symbol('=');

      const expression = this.child.expression(tokens);

      if (!expression) {
        throw this.error(tokens, 'expression()', `Expected expression here`);
      }

      values.set(value, expression);

      ensure.symbol(';');
    }

    ensure.symbol('}');

    return new EnumNode(
      identifier,
      parent,
      values,
    );
  }
}
