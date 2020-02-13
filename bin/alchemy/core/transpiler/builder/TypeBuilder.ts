import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { TypeNode, QualifierNode, TypeGenericNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface TypeChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
  type: BuildInvoker<TypeNode>;
  type_generic: BuildInvoker<TypeGenericNode<TypeNode>>;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
    const qualifier = this.child.qualifier(tokens);
    let generic: TypeGenericNode<TypeNode>|null = null;

    if (get.symbol('<')) {
      generic = this.child.type_generic(tokens);
      ensure.symbol('>');
    }

    return new TypeNode(
      qualifier,
      generic,
    );
  }
}
