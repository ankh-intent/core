import { Tokens } from '@intent/kernel/parser/Tokens';

import { PropertyNode } from '../ast/PropertyNode';
import { TypeBuilder } from './TypeBuilder';
import { BaseBuilder } from './BaseBuilder';

export interface PropertyChildren {
  type: TypeBuilder;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  build(tokens: Tokens): PropertyNode {
    const name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    const type = this.child.type.build(tokens);

    return Object.assign(new PropertyNode(), {
      name: name.value,
      type,
    });
  }
}
