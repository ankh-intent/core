import { TypedTokenMatcherInterface } from '@intent/parser';

import { FunctorArgsNode, FunctorArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type FunctorArgsChildren = {
  functor_arg: FunctorArgNode;
}

export class FunctorArgsBuilder extends BaseBuilder<FunctorArgsNode, FunctorArgsChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    const args = {};

    while (!peek.symbol(')')) {
      if (Object.keys(args).length) {
        ensure.symbol(',');
      }

      const arg = this.child.functor_arg(tokens);

      if (arg) {
        if (args[arg.name]) {
          throw tokens.error(`Property with the same name "${arg.name}" already present`);
        }

        args[arg.name] = arg;
      } else {
        const token = get.any();
        throw tokens.error(`")" or method argument expected, ${token ? `"${token.value}"` : 'EOF'} found`);
      }
    }

    return new FunctorArgsNode(
      args,
    );
  }
}
