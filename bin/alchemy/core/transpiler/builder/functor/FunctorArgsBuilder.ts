import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { FunctorArgsNode, TypePropertyNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface FunctorArgsChildren extends AlchemyBuildInvokers {
  property: BuildInvoker<TypePropertyNode>;
}

export class FunctorArgsBuilder extends BaseBuilder<FunctorArgsNode, FunctorArgsChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    const args = {};

    while (!peek.symbol(')')) {
      if (Object.keys(args).length) {
        ensure.symbol(',');
      }

      const arg = this.child.property(tokens);

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
