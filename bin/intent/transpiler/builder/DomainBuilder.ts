import { Tokens } from '@intent/kernel/parser/Tokens';

import { DomainNode } from '../ast/DomainNode';
import { TypeDefBuilder } from './TypeDefBuilder';
import { BaseBuilder } from './BaseBuilder';
import { UseBuilder } from './UseBuilder';

export interface DomainChildren {
  typedef: TypeDefBuilder;
  use: UseBuilder;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  public visit(tokens: Tokens): DomainNode {
    if (tokens.not({value: 'domain'})) {
      return null;
    }

    const { value: identifier } = tokens.get({type: 'identifier'});
    const types = {};
    const uses = {};

    tokens.ensure({value: '{'});

    while (true) {
      const use = this.child.use.visit(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      const type = this.child.typedef.visit(tokens);

      if (type) {
        if (types[type.name]) {
          throw tokens.error(`Type with the same name "${type.name}" already present in current domain`);
        }

        types[type.name] = type;

        continue;
      }

      break;
    }

    tokens.ensure({value: '}'});

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
