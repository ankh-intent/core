import { BaseBuilder, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { ChipNode } from '../ast/ChipNode';
import { UseNode } from '../ast/UseNode';
import { DomainNode } from '../ast/DomainNode';
import { CanNode } from '../ast/CanNode';

export interface ChipChildren extends AlchemyBuildInvokers {
  use: BuildInvoker<UseNode>;
  domain: BuildInvoker<DomainNode>;
  can: BuildInvoker<CanNode>;
}

export class ChipBuilder extends BaseBuilder<ChipNode, any, ChipChildren> {
  protected build(tokens, { peek, ensure }): ChipNode {
    ensure.identifier('chip');

    const { value: name } = ensure.string();

    const uses = {};
    const domains = {};
    let can: CanNode|null = null;

    ensure.symbol('{');

    while (!peek.symbol('}')) {
      const use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        const domain = this.child.domain(tokens);

        if (domain) {
          if (domains[domain.identifier]) {
            throw tokens.error(`Use with same alias "${domain.identifier}" already present`);
          }

          domains[domain.identifier] = domain;
        } else {
          break;
        }
      }
    }

    if (peek.identifier('can')) {
      can = this.child.can(tokens);
    }

    ensure.symbol('}');

    return Object.assign(new ChipNode(), {
      name,
      uses,
      domains,
      can,
    });
  }
}
