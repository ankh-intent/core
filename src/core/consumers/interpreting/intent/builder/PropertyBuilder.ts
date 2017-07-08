
import { Tokens } from '../../../parsing/parser/Tokens';
import { PropertyNode } from '../ast/PropertyNode';
import { TypeBuilder } from './TypeBuilder';
import { BaseBuilder } from './BaseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface PropertyChildren {
  type: TypeBuilder;
}

export class PropertyBuilder extends BaseBuilder<PropertyNode, PropertyChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): PropertyNode {
    let name = tokens.get({type: 'identifier'});

    if (!name) {
      return null;
    }

    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    let type = this.child.type.visit(tokens);

    let property = new PropertyNode();
    property.name = name.value;
    property.type = type;

    return property;
  }
}
