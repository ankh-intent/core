import { Tokens } from '~kernel/parser/Tokens';

import { DomainNode } from '../ast/DomainNode';
import { TypeDefBuilder } from './TypeDefBuilder';
import { BaseBuilder } from './BaseBuilder';
import { UseBuilder } from './UseBuilder';

export interface DomainChildren {
  typedef: TypeDefBuilder;
  use: UseBuilder;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  public build(tokens: Tokens): DomainNode {
    if (tokens.not({value: 'domain'})) {
      return null;
    }

    let { value: identifier } = tokens.get({type: 'identifier'});
    let types = {};
    let uses = {};

    tokens.ensure({value: '{'});

    while (true) {
      let use = this.child.use.build(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      let type = this.child.typedef.build(tokens);

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

    let domain = new DomainNode();
    domain.identifier = identifier;
    domain.types = types;
    domain.uses = uses;

    for (let t in types) {
      types[t].domain = domain;
    }

    return domain;
  }
}
