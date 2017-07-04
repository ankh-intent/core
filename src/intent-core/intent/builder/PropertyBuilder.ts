
import { Tokens } from '../../parser/Tokens';
import { PropertyNode } from '../ast/PropertyNode';
import { TypeBuilder } from './TypeBuilder';
import { BaseBuilder } from './BaseBuilder';

export interface PropertyChildren {
  type: TypeBuilder;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  build(tokens: Tokens): PropertyNode {
    let name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    let type = this.child.type.build(tokens);

    let property = new PropertyNode();
    property.name = name.value;
    property.type = type;

    return property;
  }
}
