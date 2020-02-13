import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { CallArgsNode, CallArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface CallArgsChildren extends AlchemyBuildInvokers {
  call_arg: BuildInvoker<CallArgNode>;
}

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
