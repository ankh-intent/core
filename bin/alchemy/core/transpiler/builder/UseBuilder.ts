import { BaseBuilder, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { UseNode } from '../ast/UseNode';
import { QualifierNode } from '../ast/QualifierNode';

export interface UseChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
}

export class UseBuilder extends BaseBuilder<UseNode, any, UseChildren> {
  protected build(tokens, { not, get, ensure }): UseNode {
    if (not.identifier('use')) {
      return null;
    }

    const qualifier = this.child.qualifier(tokens);
    const alias = get.identifier('as')
      ? ensure.identifier().value
      : qualifier.deepest();

    ensure.symbol(';');

    return new UseNode(
      qualifier,
      alias,
    );
  }
}
