import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../../Alchemy';
import { InterfaceNode, InterfacePropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export interface InterfaceChildren extends AlchemyBuildInvokers {
  iproperty: BuildInvoker<InterfacePropertyNode>;
}

export class InterfaceBuilder extends BaseBuilder<InterfaceNode, InterfaceChildren> {
  protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
    if (not.symbol('{')) {
      return null;
    }

    const properties = new Map<string, InterfacePropertyNode>();

    while (peek.identifier()) {
      const property = this.child.iproperty(tokens);

      if (properties.has(property.identifier)) {
        throw this.error(tokens, property, `Property with same name "${property.identifier}" already exists`);
      }

      properties.set(property.identifier, property);

      ensure.symbol(',');
    }

    ensure.symbol('}');

    return new InterfaceNode(
      properties,
    );
  }
}
