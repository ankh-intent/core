import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { UseNode, DecompositionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface UseChildren extends AlchemyBuildInvokers {
  decomposition: BuildInvoker<DecompositionNode>
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    if (not.identifier('use')) {
      return null;
    }

    const decomposition = this.child.decomposition(tokens);

    ensure.symbol(';');

    return new UseNode(
      decomposition,
    );
  }
}
