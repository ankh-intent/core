
import { Tokens } from '../../parser/Tokens';
import { TypeDefNode } from '../ast/TypeDefNode';
import { BaseBuilder } from './BaseBuilder';
import { PropertyBuilder } from './PropertyBuilder';
import { TypeBuilder } from './TypeBuilder';

interface TypeDefChildren {
  property: PropertyBuilder;
  type: TypeBuilder;
}

export class TypeDefBuilder extends BaseBuilder<TypeDefNode, TypeDefChildren> {
  build(tokens: Tokens): TypeDefNode {
    if (tokens.not({value: 'type'})) {
      return null;
    }

    let { value: name } = tokens.get({type: 'identifier'});
    let parent = null;
    let properties = {};

    if (tokens.get({value: 'extends'})) {
      parent = this.child.type.build(tokens);
    }

    tokens.ensure({value: '{'});

    while (true) {
      let property = this.child.property.build(tokens);

      if (property) {
        if (properties[property.name]) {
          throw new Error(`Property with the same name "${property.name}" already present`);
        }

        properties[property.name] = property;
      } else {
        break;
      }
    }

    tokens.ensure({value: '}'});

    let type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;

    return type;
  }
}
