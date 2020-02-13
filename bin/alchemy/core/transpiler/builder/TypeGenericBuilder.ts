import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { TypeNode, TypeGenericNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface TypeGenericChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
}

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
