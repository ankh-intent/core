import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { DomainNode, UseNode, ModuleNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface ModuleChildren extends AlchemyBuildInvokers {
  domain: BuildInvoker<DomainNode>;
  use: BuildInvoker<UseNode>;
}

export class ModuleBuilder extends BaseBuilder<ModuleNode, ModuleChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    const uses = {};

    while (true) {
      const use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      break;
    }

    const domain = this.child.domain(tokens);

    const module = new ModuleNode();
    module.domain = domain;
    module.uses = uses;

    return module;
  }
}
