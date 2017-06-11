
import { Tokens } from '../../parser/Tokens';
import { PropertyNode } from '../ast/PropertyNode';
import { TypeBuilder } from './TypeBuilder';
import { BaseBuilder } from './BaseBuilder';

interface PropertyChildren {
  type: TypeBuilder;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  build(tokens: Tokens): PropertyNode {
    let name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    tokens.ensure({type: 'symbol', value: ':'});

    let type = this.child.type.build(tokens);

    tokens.ensure({type: 'symbol', value: ';'});

    let property = new PropertyNode();
    property.name = name.value;
    property.type = type;

    return property;
  }
}
