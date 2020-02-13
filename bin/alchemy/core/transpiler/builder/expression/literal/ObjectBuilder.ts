import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../../Alchemy';
import { ObjectNode, ObjectPropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export interface ObjectChildren extends AlchemyBuildInvokers {
  object_property: BuildInvoker<ObjectPropertyNode>;
}

export class ObjectBuilder extends BaseBuilder<ObjectNode, ObjectChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const properties = new Map<string, ObjectPropertyNode>();

    while (peek.identifier()) {
      const property = this.child.object_property(tokens);

      if (properties.has(property.identifier)) {
        throw this.error(tokens, property, `Property with same name "${property.identifier}" already exists`);
      }

      properties.set(property.identifier, property);

      ensure.symbol(',');
    }

    ensure.symbol('}');

    return new ObjectNode(
      properties,
    );
  }
}
