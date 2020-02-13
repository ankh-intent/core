import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, FunctorArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgChildren = {
  type: TypeNode;
};

export class FunctorArgBuilder extends BaseBuilder<FunctorArgNode, FunctorArgChildren> {
  protected build(tokens, { get, not }: TypedTokenMatcherInterface) {
    const name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol(':')) {
      return null;
    }

    const type = this.child.type(tokens);

    return new FunctorArgNode(
      name,
      type,
    );
  }
}
