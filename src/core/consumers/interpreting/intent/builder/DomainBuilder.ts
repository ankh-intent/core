
import { Tokens } from '../../../parsing/parser/Tokens';
import { DomainNode } from '../ast/DomainNode';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { TypeDefNode } from '../ast/TypeDefNode';
import { UseNode } from '../ast/UseNode';

export interface DomainChildren {
  typedef: BuildInvoker<TypeDefNode>;
  use: BuildInvoker<UseNode>;
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
      let use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      let type = this.child.typedef(tokens);

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
