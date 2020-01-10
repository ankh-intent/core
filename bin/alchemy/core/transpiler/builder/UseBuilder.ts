import { TypedTokenMatcherInterface } from '@intent/kernel/parser/TokenMatcher';
import { BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { UseNode } from '../ast/UseNode';
import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder } from './BaseBuilder';

export interface UseChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    if (not.identifier('use')) {
      return null;
    }

    const qualifier = this.child.qualifier(tokens);
    const alias = get.identifier('as')
      ? ensure.identifier()
      : qualifier.deepest();

    ensure.symbol(';');

    return new UseNode(
      qualifier,
      alias,
    );
  }
}
