import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { ChipNode } from '../ast/ChipNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { UseNode } from '../ast/UseNode';
import { DomainNode } from '../ast/DomainNode';
import { CanNode } from '../ast/CanNode';

export interface ChipChildren extends BuilderInvokers<any> {
  use: BuildInvoker<UseNode>;
  domain: BuildInvoker<DomainNode>;
  can: BuildInvoker<CanNode>;
}

export class ChipBuilder extends BaseBuilder<ChipNode, ChipChildren> {
  protected build(tokens: Tokens, {peek, ensure}: TokenMatcher): ChipNode {
    ensure.identifier('chip');

    const { value: name } = ensure.string();

    const uses = {};
    const domains = {};
    let can = null;

    ensure.symbol('{');

    while (true) {
      if (peek.symbol('}')) {
        break;
      }

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
