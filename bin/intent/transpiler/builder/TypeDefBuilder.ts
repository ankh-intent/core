import { Tokens } from '@intent/kernel/parser/Tokens';

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
  visit(tokens: Tokens): TypeDefNode {
    if (tokens.not({value: 'type'})) {
      return null;
    }

    const { value: name } = tokens.get({type: 'identifier'});
    const properties = {};
    const constraints = {};
    const cans = {};
    const parent = tokens.get({value: 'extends'})
      ? this.child.type.visit(tokens)
      : null
    ;

    tokens.ensure({value: '{'});

    while (true) {
      const constraint = this.child.constraint.visit(tokens);

      if (constraint) {
        if (constraints[constraint.can.name]) {
          throw tokens.error(`Constraint with the same name "${constraint.can.name}" already present`);
        }

        constraints[constraint.can.name] = constraint;
        continue;
      }

      const property = this.child.property.visit(tokens);

      if (property) {
        if (properties[property.name]) {
          throw tokens.error(`Property with the same name "${property.name}" already present`);
        }

        tokens.ensure({type: 'symbol', value: ';'});
        properties[property.name] = property;

        continue;
      }

      const can = this.child.can.visit(tokens);

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

    const type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;
    type.can = cans;
    type.constraints = constraints;

    return type;
  }
}
