
import { Tokens } from '../../parser/Tokens';

import { ChipNode } from '../ast/ChipNode';
import { BaseBuilder } from './BaseBuilder';
import { UseBuilder } from "./UseBuilder";
import { CanBuilder } from './CanBuilder';
import { DomainBuilder } from './DomainBuilder';

export interface ChipChildren {
  use: UseBuilder;
  domain: DomainBuilder;
  can: CanBuilder;
}

export class ChipBuilder extends BaseBuilder<ChipNode, ChipChildren> {
  public build(tokens: Tokens): ChipNode {
    tokens.ensure({value: 'chip'});

    let { value: name } = tokens.ensure({type: 'string'});

    let uses = {};
    let domains = {};

    tokens.ensure({value: '{'});

    while (true) {
      if (tokens.peek({type: 'symbol', value: '}'})) {
        break;
      }

      let use = this.child.use.build(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw new Error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        let domain = this.child.domain.build(tokens);

        if (domain) {
          if (domains[domain.identifier]) {
            throw new Error(`Use with same alias "${domain.identifier}" already present`);
          }

          domains[domain.identifier] = domain;
        } else {
          break;
        }
      }
    }

    let can = this.child.can.build(tokens);

    tokens.ensure({value: '}'});

    let chip = new ChipNode();
    chip.name = name;
    chip.uses = uses;
    chip.domains = domains;
    chip.can = can;

    return chip;
  }
}
