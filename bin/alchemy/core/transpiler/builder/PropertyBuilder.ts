import { TypedTokenMatcherInterface } from '@intent/kernel/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { PropertyNode, TypeNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface PropertyChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  protected build(tokens, { get, not }: TypedTokenMatcherInterface) {
    const name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol(':')) {
      return null;
    }

    const type = this.child.type(tokens);

    return new PropertyNode(
      name,
      type,
    );
  }
}
