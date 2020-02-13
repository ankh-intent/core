import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorNode, TypeNode, FunctorArgsNode, FunctorBodyNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorChildren = {
  type: TypeNode;
  functor_args: FunctorArgsNode;
  functor_body: FunctorBodyNode;
}

export class FunctorBuilder extends BaseBuilder<FunctorNode, FunctorChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    if (not.symbol('(')) {
      return null;
    }

    const args = this.child.functor_args(tokens);

    ensure.symbol(')');

    const returns = get.symbol(':') ? this.child.type(tokens) : null;

    ensure.symbol('=>');

    const body = this.child.functor_body(tokens);

    return new FunctorNode(
      args,
      returns,
      body,
    );
  }
}
