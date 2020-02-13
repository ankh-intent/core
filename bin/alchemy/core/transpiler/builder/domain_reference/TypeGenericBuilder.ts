import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, TypeGenericNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeGenericChildren = {
  type: TypeNode;
};

export class TypeGenericBuilder extends BaseBuilder<TypeGenericNode<TypeNode>, TypeGenericChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const types: TypeNode[] = [];

    while (true) {
      if (types.length) {
        if (!peek.symbol(',')) {
          break;
        }

        ensure.symbol(',');
      }

      const type = this.child.type(tokens);

      if (type) {
        types.push(type);
      } else {
        break;
      }
    }

    if (types.length) {
      return new TypeGenericNode<TypeNode>(
        types,
      );
    }

    return null;
  }
}
