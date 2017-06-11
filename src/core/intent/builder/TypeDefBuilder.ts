
import { Tokens } from '../../parser/Tokens';
import { TypeDefNode } from '../ast/TypeDefNode';
import { BaseBuilder } from './BaseBuilder';
import { PropertyBuilder } from './PropertyBuilder';
import { TypeBuilder } from './TypeBuilder';
import { CanBuilder } from './CanBuilder';
import { ConstraintBuilder } from './ConstraintBuilder';

export interface TypeDefChildren {
  property: PropertyBuilder;
  type: TypeBuilder;
  can: CanBuilder;
  constraint: ConstraintBuilder;
}

export class TypeDefBuilder extends BaseBuilder<TypeDefNode, TypeDefChildren> {
  build(tokens: Tokens): TypeDefNode {
    if (tokens.not({value: 'type'})) {
      return null;
    }

    let { value: name } = tokens.get({type: 'identifier'});
    let parent = null;
    let properties = {};
    let constraints = {};
    let cans = {};

    if (tokens.get({value: 'extends'})) {
      parent = this.child.type.build(tokens);
    }

    tokens.ensure({value: '{'});

    while (true) {
      let constraint = this.child.constraint.build(tokens);

      if (constraint) {
        if (constraints[constraint.can.name]) {
          throw tokens.error(`Constraint with the same name "${constraint.can.name}" already present`);
        }

        constraints[constraint.can.name] = constraint;
        continue;
      }

      let property = this.child.property.build(tokens);

      if (property) {
        if (properties[property.name]) {
          throw tokens.error(`Property with the same name "${property.name}" already present`);
        }

        tokens.ensure({type: 'symbol', value: ';'});
        properties[property.name] = property;

        continue;
      }

      let can = this.child.can.build(tokens);

      if (can) {
        if (cans[can.name]) {
          throw tokens.error(`Method with the same name "${can.name}" already present`);
        }

        cans[can.name] = can;

        continue;
      }

      break;
    }

    tokens.ensure({value: '}'});

    let type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;
    type.can = cans;

    return type;
  }
}
