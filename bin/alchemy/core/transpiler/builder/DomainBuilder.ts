import { TypedTokenMatcherInterface } from '@intent/kernel/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { DomainNode, TypeDefNode, UseNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface DomainChildren extends AlchemyBuildInvokers {
  typedef: BuildInvoker<TypeDefNode>;
  use: BuildInvoker<UseNode>;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  protected build(tokens, { not, get, ensure }: TypedTokenMatcherInterface) {
    if (not.identifier('domain')) {
      return null;
    }

    const identifier = get.identifier();
    const types = {};
    const uses = {};

    ensure.symbol('{');

    while (true) {
      const use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      const type = this.child.typedef(tokens);

      if (type) {
        if (types[type.name]) {
          throw tokens.error(`Type with the same name "${type.name}" already present in current domain`);
        }

        types[type.name] = type;

        continue;
      }

      break;
    }

    ensure.symbol('}');

    const domain = new DomainNode();
    domain.identifier = identifier;
    domain.types = types;
    domain.uses = uses;

    for (const t in types) {
      types[t].domain = domain;
    }

    return domain;
  }
}
