import { TypedTokenMatcherInterface } from '@intent/kernel/parser/TokenMatcher';
import { IntentBuildInvokers } from '../Intent';
import { ModuleNode } from '../ast/ModuleNode';
import { BaseBuilder } from './BaseBuilder';

export interface ModuleChildren extends IntentBuildInvokers {
}

export class ModuleBuilder extends BaseBuilder<ModuleNode, ModuleChildren> {
  protected build(tokens, { peek, ensure }: TypedTokenMatcherInterface) {
    ensure.identifier('chip');

    const name = ensure.string();
    const uses = {};
    const domains = {};
    let can = null;

    ensure.symbol('{');

    while (!peek.symbol('}')) {
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

    return Object.assign(new ModuleNode(), {
      name,
      uses,
      domains,
      can,
    });
  }
}
