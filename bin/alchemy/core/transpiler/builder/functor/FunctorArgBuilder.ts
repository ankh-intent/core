import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, FunctorArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgChildren = {
  type: TypeNode;
};

export class FunctorArgBuilder extends BaseBuilder<FunctorArgNode, FunctorArgChildren> {
  protected build(tokens, { get, not, ensure }: TypedTokenMatcherInterface) {
    const name = ensure.identifier();
    const type = this.child.type(tokens);

    return new FunctorArgNode(
      name,
      type,
    );
  }
}
