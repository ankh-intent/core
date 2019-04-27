import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { PropertyNode } from '../ast/PropertyNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { TypeNode } from '../ast/TypeNode';

export interface PropertyChildren extends BuilderInvokers<any> {
  type: BuildInvoker<TypeNode>;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  protected build(tokens: Tokens, {get, not}: TokenMatcher): PropertyNode {
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
