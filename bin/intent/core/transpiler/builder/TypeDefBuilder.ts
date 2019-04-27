import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { TypeDefNode } from '../ast/TypeDefNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';
import { TypeNode } from '../ast/TypeNode';
import { PropertyNode } from '../ast/PropertyNode';
import { CanNode } from '../ast/CanNode';
import { ConstraintNode } from '../ast/ConstraintNode';

export interface TypeDefChildren extends BuilderInvokers<any> {
  property: BuildInvoker<PropertyNode>;
  type: BuildInvoker<TypeNode>;
  can: BuildInvoker<CanNode>;
  constraint: BuildInvoker<ConstraintNode>;
}

export class TypeDefBuilder extends BaseBuilder<TypeDefNode, TypeDefChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): TypeDefNode {
    if (not.identifier('type')) {
      return null;
    }

    const { value: name } = get.identifier();
    const properties = {};
    const constraints = {};
    const cans = {};
    const parent = get.identifier('extends')
      ? this.child.type(tokens)
      : null;

    ensure.symbol('{');

    while (true) {
      const constraint = this.child.constraint(tokens);

      if (constraint) {
        if (constraints[constraint.can.name]) {
          throw tokens.error(`Constraint with the same name "${constraint.can.name}" already present`);
        }

        constraints[constraint.can.name] = constraint;
        continue;
      }

      const property = this.child.property(tokens);

      if (property) {
        if (properties[property.name]) {
          throw tokens.error(`Property with the same name "${property.name}" already present`);
        }

        ensure.symbol(';');
        properties[property.name] = property;

        continue;
      }

      const can = this.child.can(tokens);

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

    const type = new TypeDefNode();
    type.name = name;
    type.parent = parent;
    type.properties = properties;
    type.can = cans;
    type.constraints = constraints;

    return type;
  }
}
