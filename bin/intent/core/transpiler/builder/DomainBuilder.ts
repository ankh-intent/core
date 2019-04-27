import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { DomainNode } from '../ast/DomainNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';
import { TypeDefNode } from '../ast/TypeDefNode';
import { UseNode } from '../ast/UseNode';

export interface DomainChildren extends BuilderInvokers<any> {
  typedef: BuildInvoker<TypeDefNode>;
  use: BuildInvoker<UseNode>;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): DomainNode {
    if (not.identifier('domain')) {
      return null;
    }

    const { value: identifier } = get.identifier();
    const types = {};
    const uses = {};

    ensure.symbol('{');

    while (true) {
      const use = this.child.use(tokens);

      if (use) {
        if (uses[use.alias]) {
          throw tokens.error(`Use with the same name "${use.alias}" already present`);
        }

        uses[use.alias] = use;

        continue;
      }

      const type = this.child.typedef(tokens);

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
