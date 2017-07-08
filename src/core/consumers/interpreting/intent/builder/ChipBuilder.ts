
import { Tokens } from '../../../parsing/parser/Tokens';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';

import { ChipNode } from '../ast/ChipNode';
import { BaseBuilder } from './BaseBuilder';
import { UseBuilder } from './UseBuilder';
import { CanBuilder } from './CanBuilder';
import { DomainBuilder } from './DomainBuilder';

export interface ChipChildren {
  use: UseBuilder;
  domain: DomainBuilder;
  can: CanBuilder;
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

      let use = this.child.use.visit(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        let domain = this.child.domain.visit(tokens);

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
      can = this.child.can.visit(tokens);
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
