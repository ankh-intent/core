import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { FunctorNode, TypeNode, FunctorArgsNode, FunctorBodyNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface FunctorChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
  args: BuildInvoker<FunctorArgsNode>;
  block: BuildInvoker<FunctorBodyNode>;
}

export class FunctorBuilder extends BaseBuilder<FunctorNode, FunctorChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    if (not.symbol('(')) {
      return null;
    }

    const args = this.child.args(tokens);

    ensure.symbol(')');

    const returns = get.symbol(':') ? this.child.type(tokens) : null;

    ensure.symbol('=>');

    const body = this.child.block(tokens);

    return new FunctorNode(
      args,
      returns,
      body,
    );
  }
}
