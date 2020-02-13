import { TypedTokenMatcherInterface } from '@intent/parser';

import { CallArgsNode, CallArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type CallArgsChildren = {
  call_arg: CallArgNode;
};

export class CallArgsBuilder extends BaseBuilder<CallArgsNode, CallArgsChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const args: CallArgNode[] = [];

    while (true) {
      if (peek.symbol(')')) {
        break;
      }

      if (args.length) {
        ensure.symbol(',');
      }

      args.push(this.child.call_arg(tokens))
    }

    return new CallArgsNode(
      args,
    );
  }
}
