import { Tokens } from '@intent/kernel/parser/Tokens';

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
  public build(tokens: Tokens): ChipNode {
    tokens.ensure({value: 'chip'});

    const { value: name } = tokens.ensure({type: 'string'});

    const uses = {};
    const domains = {};
    let can = null;

    tokens.ensure({value: '{'});

    while (true) {
      if (tokens.peek({type: 'symbol', value: '}'})) {
        break;
      }

      const use = this.child.use.build(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with same alias "${use.alias}" already present`);
        }

        uses[use.alias] = use;
      } else {
        const domain = this.child.domain.build(tokens);

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

    if (tokens.peek({type: 'identifier', value: 'can'})) {
      can = this.child.can.build(tokens);
    }

    tokens.ensure({value: '}'});

    return Object.assign(new ChipNode(), {
      name,
      uses,
      domains,
      can,
    });
  }
}
