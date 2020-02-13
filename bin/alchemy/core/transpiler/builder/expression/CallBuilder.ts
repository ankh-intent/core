import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { BinaryOperationNode, CallArgsNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface CallChildren extends AlchemyBuildInvokers {
  call_args: BuildInvoker<CallArgsNode>;
}

export class CallBuilder extends BaseBuilder<BinaryOperationNode, CallChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('(');
    const args = this.child.call_args(tokens);
    ensure.symbol(')');

    return new BinaryOperationNode('(', args);
  }
}
