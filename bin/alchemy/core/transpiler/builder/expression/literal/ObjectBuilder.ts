import { TypedTokenMatcherInterface } from '@intent/parser';

import { ObjectNode, ObjectPropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectChildren = {
  object_property: ObjectPropertyNode;
};

export class ObjectBuilder extends BaseBuilder<ObjectNode, ObjectChildren> {
  protected build(tokens, { get, peek, not, ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('{');

    const properties = new Map<string, ObjectPropertyNode>();

    while (!peek.symbol('}')) {
      const property = this.child.object_property(tokens);

      if (properties.has(property.identifier)) {
        throw this.error(tokens, property, `Property with same name "${property.identifier}" already exists`);
      }

      properties.set(property.identifier, property);

      if (not.symbol(',')) {
        break;
      }
    }

    ensure.symbol('}');

    return new ObjectNode(
      properties,
    );
  }
}
