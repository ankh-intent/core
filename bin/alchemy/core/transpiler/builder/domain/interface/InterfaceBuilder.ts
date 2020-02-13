import { TypedTokenMatcherInterface } from '@intent/parser';

import { DomainInterfaceNode, DomainInterfacePropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type DomainInterfaceChildren = {
  domain_interface_property: DomainInterfacePropertyNode;
};

export class InterfaceBuilder extends BaseBuilder<DomainInterfaceNode, DomainInterfaceChildren> {
  protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
    if (not.symbol('{')) {
      return null;
    }

    const properties = new Map<string, DomainInterfacePropertyNode>();

    while (peek.identifier()) {
      const property = this.child.domain_interface_property(tokens);

      if (properties.has(property.identifier)) {
        throw this.error(tokens, property, `Property with same name "${property.identifier}" already exists`);
      }

      properties.set(property.identifier, property);

      ensure.symbol(',');
    }

    ensure.symbol('}');

    return new DomainInterfaceNode(
      properties,
    );
  }
}
