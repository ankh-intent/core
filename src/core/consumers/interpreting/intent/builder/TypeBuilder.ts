
import { Tokens } from '../../../parsing/parser/Tokens';
import { TypeNode } from '../ast/TypeNode';
import { QualifierBuilder } from './QualifierBuilder';
import { BaseBuilder } from './BaseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface TypeChildren {
  qualifier: QualifierBuilder;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): TypeNode {
    let qualifier = this.child.qualifier.visit(tokens);
    let generic = null;

    if (tokens.get({type: 'symbol', value: '<'})) {
      generic = this.visit(tokens);
      tokens.ensure({type: 'symbol', value: '>'});
    }

    let type = new TypeNode();
    type.qualifier = qualifier;
    type.generic = generic;

    return type;
  }
}
