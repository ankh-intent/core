import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, FunctorArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgChildren = {
  type: TypeNode;
};

export class FunctorArgBuilder extends BaseBuilder<FunctorArgNode, FunctorArgChildren> {
  protected build(tokens, { peek, ensure }: TypedTokenMatcherInterface) {
    const name = ensure.identifier();

    if (peek.symbol(':')) {
      tokens.mark('IS_FUNCTOR');
    }

    ensure.symbol(':');

    const type = this.child.type(tokens);

    return new FunctorArgNode(
      name,
      type,
    );
  }
}
