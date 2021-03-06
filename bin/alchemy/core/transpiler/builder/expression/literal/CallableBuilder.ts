import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorNode, CallableNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type CallableChildren = {
  functor: FunctorNode;
};

export class CallableBuilder extends BaseBuilder<CallableNode, CallableChildren> {
  protected build(tokens, { get, peek, not, ensure }: TypedTokenMatcherInterface) {
    const functor = this.child.functor(tokens);

    return new CallableNode(
      functor,
    );
  }
}
