import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { QualifierNode, DecompositionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface DecompositionChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>
  decomposition: BuildInvoker<DecompositionNode>
}

export class DecompositionBuilder extends BaseBuilder<DecompositionNode, DecompositionChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    const children = {};
    const qualifier = this.child.qualifier(tokens);
    let alias = qualifier.deepest();

    if (get.identifier('as')) {
      alias = ensure.identifier();
    } else if (get.symbol(':')) {
      ensure.symbol('{');

      while (true) {
        const decomposition = this.child.decomposition(tokens);

        if (children[decomposition.alias]) {
          throw tokens.error(`Use with the same name "${decomposition.alias}" already present`);
        }

        children[decomposition.alias] = decomposition;

        if (get.symbol('}')) {
          break;
        }

        ensure.symbol(',');
      }
    }

    return new DecompositionNode(
      qualifier,
      alias,
      children,
    );
  }
}
