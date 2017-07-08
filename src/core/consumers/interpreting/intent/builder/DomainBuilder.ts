
import { Tokens } from '../../../parsing/parser/Tokens';
import { DomainNode } from '../ast/DomainNode';
import { TypeDefBuilder } from './TypeDefBuilder';
import { BaseBuilder } from './BaseBuilder';
import { UseBuilder } from './UseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface DomainChildren {
  typedef: TypeDefBuilder;
  use: UseBuilder;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): DomainNode {
    if (not.identifier('domain')) {
      return null;
    }

    let { value: identifier } = get.identifier();
    let types = {};
    let uses = {};

    ensure.symbol('{');

    while (true) {
      let use = this.child.use.visit(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      let type = this.child.typedef.visit(tokens);

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
