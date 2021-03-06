import { TypedTokenMatcherInterface } from '@intent/parser';

import { QualifierNode, DecompositionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type DecompositionChildren = {
  qualifier: QualifierNode;
  decomposition: DecompositionNode;
};

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
          throw this.error(tokens, decomposition, `Use with the same name "${decomposition.alias}" already present`);
        }

        children[decomposition.alias] = decomposition;

        ensure.symbol(',');

        if (get.symbol('}')) {
          break;
        }
      }
    }

    return new DecompositionNode(
      qualifier,
      alias,
      children,
    );
  }
}
