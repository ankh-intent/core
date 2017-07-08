
import { Tokens } from '../../../parsing/parser/Tokens';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';

import { ChipNode } from '../ast/ChipNode';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { UseNode } from '../ast/UseNode';
import { DomainNode } from '../ast/DomainNode';
import { CanNode } from '../ast/CanNode';

export interface ChipChildren {
  use: BuildInvoker<UseNode>;
  domain: BuildInvoker<DomainNode>;
  can: BuildInvoker<CanNode>;
}

export class ChipBuilder extends BaseBuilder<ChipNode, ChipChildren> {
  protected build(tokens: Tokens, {peek, ensure}: TokenMatcher): ChipNode {
    ensure.identifier('chip');

    let { value: name } = ensure.string();

    let uses = {};
    let domains = {};
    let can = null;

    ensure.symbol('{');

    while (true) {
      if (peek.symbol('}')) {
        break;
      }

      let use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        let domain = this.child.domain(tokens);

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

    let chip = new ChipNode();
    chip.name = name;
    chip.uses = uses;
    chip.domains = domains;
    chip.can = can;

    return chip;
  }
}
