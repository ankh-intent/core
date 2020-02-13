import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, QualifierNode, TypeGenericNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type TypeChildren = {
  qualifier: QualifierNode;
  type: TypeNode;
  type_generic: TypeGenericNode<TypeNode>;
};

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
    const qualifier = this.child.qualifier(tokens);
    let generic: TypeGenericNode<TypeNode>|null = null;
    let isArray = false;

    if (get.symbol('<')) {
      generic = this.child.type_generic(tokens);
      ensure.symbol('>');
    }

    if (get.symbol('[')) {
      isArray = true;
      ensure.symbol(']');
    }

    return new TypeNode(
      qualifier,
      generic,
      isArray,
    );
  }
}
