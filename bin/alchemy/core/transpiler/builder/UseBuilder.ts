import { TypedTokenMatcherInterface } from '@intent/kernel/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { UseNode, QualifierNode } from '../ast';
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
