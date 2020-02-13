import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { CanNode, FunctorNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface CanChildren extends AlchemyBuildInvokers {
  functor: BuildInvoker<FunctorNode>;
}

export class CanBuilder extends BaseBuilder<CanNode, CanChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    const name = get.identifier();

    if (!name) {
      return null;
    }

    const func = this.child.functor(tokens);

    const can = new CanNode();
    can.name = name;
    can.func = func;

    return can;
  }
}
