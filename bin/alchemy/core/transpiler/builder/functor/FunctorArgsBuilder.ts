import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorArgsNode, FunctorArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgsChildren = {
  functor_arg: FunctorArgNode;
}

export class FunctorArgsBuilder extends BaseBuilder<FunctorArgsNode, FunctorArgsChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    const args: FunctorArgNode[] = [];

    while (!peek.symbol(')')) {
      const arg = this.child.functor_arg(tokens);

      if (arg.name && args.find(a => a.name === arg.name)) {
        throw tokens.error(`Argument with the same name "${arg.name}" already present`);
      }

      args.push(arg);

      if (not.symbol(',')) {
        break;
      }
    }

    return new FunctorArgsNode(
      args,
    );
  }
}
