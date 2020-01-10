import { TypedTokenMatcherInterface } from '@intent/kernel/parser';
import { BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { TypeNode, QualifierNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface TypeChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
    const qualifier = this.child.qualifier(tokens);
    let generic: TypeNode|null = null;

    if (get.symbol('<')) {
      generic = this.visit(tokens);
      ensure.symbol('>');
    }

    return new TypeNode(
      qualifier,
      generic,
    );
  }
}
