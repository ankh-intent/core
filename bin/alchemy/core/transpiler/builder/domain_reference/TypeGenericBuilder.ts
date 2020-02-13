import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, TypeGenericNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeGenericChildren = {
  type: TypeNode;
};

export class TypeGenericBuilder extends BaseBuilder<TypeGenericNode<TypeNode>, TypeGenericChildren> {
  protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
    const types: TypeNode[] = [];

    while (true) {
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
