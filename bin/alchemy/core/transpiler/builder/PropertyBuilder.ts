import { BaseBuilder, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { PropertyNode } from '../ast/PropertyNode';
import { TypeNode } from '../ast/TypeNode';

export interface PropertyChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, any, PropertyChildren> {
  protected build(tokens, { get, not }): PropertyNode {
    const name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol(':')) {
      return null;
    }

    const type = this.child.type(tokens);

    return new PropertyNode(
      name.value,
      type,
    );
  }
}
