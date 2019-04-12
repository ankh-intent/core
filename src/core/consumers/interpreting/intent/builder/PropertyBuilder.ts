
import { Tokens } from '../../../parsing/parser/Tokens';
import { PropertyNode } from '../ast/PropertyNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { TypeNode } from '../ast/TypeNode';

export interface PropertyChildren extends BuilderInvokers<any> {
  type: BuildInvoker<TypeNode>;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  protected build(tokens: Tokens, {get, not}: TokenMatcher): PropertyNode {
    let name = get.identifier();

    if (!name) {
      return null;
    }

    if (not.symbol(':')) {
      return null;
    }

    let type = this.child.type(tokens);

    let property = new PropertyNode();
    property.name = name.value;
    property.type = type;

    return property;
  }
}
