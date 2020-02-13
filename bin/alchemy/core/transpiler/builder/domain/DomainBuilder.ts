import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { DomainNode, UsesNode, FunctorNode, TypeNode, EnumNode, ExpressionNode, InterfaceNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface DomainChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
  enum: BuildInvoker<EnumNode>;
  domain: BuildInvoker<DomainNode>;
  uses: BuildInvoker<UsesNode>;
  functor: BuildInvoker<FunctorNode>;
  expression: BuildInvoker<ExpressionNode>;
  interface: BuildInvoker<InterfaceNode>;
}

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
    if (not.identifier('domain')) {
      return null;
    }

    const identifier = get.identifier();
    const parent: TypeNode|null = get.identifier('extends')
      ? this.child.type(tokens)
      : null;

    ensure.symbol('{');

    const uses = this.child.uses(tokens);
    const intf = this.child.interface(tokens);
    const domains = new Map<string, DomainNode>();
    const methods = new Map<string, FunctorNode>();
    const traits = new Set<ExpressionNode>();

    while (true) {
      const domain = this.child.domain(tokens);

      if (domain) {
        if (domains.has(domain.identifier)) {
          throw this.error(tokens, domain, `Domain with the same name "${domain.identifier}" already present`);
        }

        domains.set(domain.identifier, domain);

        continue;
      }

      const enumeration = this.child.enum(tokens);

      if (enumeration) {
        if (domains.has(enumeration.identifier)) {
          throw this.error(tokens, enumeration, `Enum with the same name "${enumeration.identifier}" already present`);
        }

        domains.set(enumeration.identifier, enumeration);

        continue;
      }

      if (get.identifier('is')) {
        const trait = this.child.expression(tokens);

        traits.add(trait);

        ensure.symbol(';');

        continue;
      }

      break;
    }

    while (true) {
      const name = get.identifier();

      if (name) {
        const method = this.child.functor(tokens);

        if (method) {
          if (methods.has(name)) {
            throw this.error(tokens, method, `Method with the same name "${name}" already present`);
          }

          methods.set(name, method);

          continue;
        } else {
          throw this.error(tokens, 'method', `Method body expected`);
        }
      }

      break;
    }

    const ctor = peek.symbol('(') ? this.child.functor(tokens) : null;

    ensure.symbol('}');

    return new DomainNode(
      identifier,
      parent,
      intf,
      uses,
      domains,
      methods,
      ctor,
    );
  }
}
