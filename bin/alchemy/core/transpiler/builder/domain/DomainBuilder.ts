import { TypedTokenMatcherInterface } from '@intent/parser';

import {
  DomainNode,
  UsesNode,
  FunctorNode,
  ReferenceNode,
  EnumNode,
  ExpressionNode,
  DomainInterfaceNode,
  GenericTemplatesNode,
} from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type DomainChildren = {
  type: ReferenceNode;
  generic_templates: GenericTemplatesNode;
  enum: EnumNode;
  domain: DomainNode;
  uses: UsesNode;
  functor: FunctorNode;
  expression: ExpressionNode;
  domain_interface: DomainInterfaceNode;
};

export class DomainBuilder extends BaseBuilder<DomainNode, DomainChildren> {
  protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
    if (not.identifier('domain')) {
      return null;
    }

    const identifier = ensure.identifier();
    const generics = this.child.generic_templates(tokens);
    const parent: ReferenceNode|undefined = get.identifier('extends')
      ? this.child.type(tokens)
      : undefined;

    ensure.symbol('{');

    const uses = this.child.uses(tokens);
    const intf = this.child.domain_interface(tokens);
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
      generics,
      parent,
      intf,
      uses,
      domains,
      methods,
      ctor,
    );
  }
}
