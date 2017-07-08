
import { Tokens } from '../../../parsing/parser/Tokens';
import { TypeDefNode } from '../ast/TypeDefNode';
import { BaseBuilder } from './BaseBuilder';
import { PropertyBuilder } from './PropertyBuilder';
import { TypeBuilder } from './TypeBuilder';
import { CanBuilder } from './CanBuilder';
import { ConstraintBuilder } from './ConstraintBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface TypeDefChildren {
  property: PropertyBuilder;
  type: TypeBuilder;
  can: CanBuilder;
  constraint: ConstraintBuilder;
}

export class TypeDefBuilder extends BaseBuilder<TypeDefNode, TypeDefChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): TypeDefNode {
    if (not.identifier('type')) {
      return null;
    }

    let { value: name } = get.identifier();
    let parent = null;
    let properties = {};
    let constraints = {};
    let cans = {};

    if (get.identifier('extends')) {
      parent = this.child.type.visit(tokens);
    }

    ensure.symbol('{');

    while (true) {
      let constraint = this.child.constraint.visit(tokens);

      if (constraint) {
        if (constraints[constraint.can.name]) {
          throw tokens.error(`Constraint with the same name "${constraint.can.name}" already present`);
        }

        constraints[constraint.can.name] = constraint;
        continue;
      }

      let property = this.child.property.visit(tokens);

      if (property) {
        if (properties[property.name]) {
          throw tokens.error(`Property with the same name "${property.name}" already present`);
        }

        ensure.symbol(';');
        properties[property.name] = property;

        continue;
      }

      let can = this.child.can.visit(tokens);

      if (can) {
        if (cans[can.name]) {
          throw tokens.error(`Method with the same name "${can.name}" already present`);
        }

        cans[can.name] = can;

        continue;
      }

      break;
    }

    ensure.symbol('}');

    let type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;
    type.can = cans;
    type.constraints = constraints;

    return type;
  }
}
