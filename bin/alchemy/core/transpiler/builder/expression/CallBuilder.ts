import { TypedTokenMatcherInterface } from '@intent/parser';

import { CallArgsNode, CallNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type CallChildren = {
  call_args: CallArgsNode;
};

export class CallBuilder extends BaseBuilder<CallNode, CallChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('(');
    const args = this.child.call_args(tokens);
    ensure.symbol(')');

    return new CallNode(args);
  }
}
