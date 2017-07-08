
import { Tokens } from '../../../parsing/parser/Tokens';
import { TypeNode } from '../ast/TypeNode';
import { QualifierBuilder } from './QualifierBuilder';
import { BaseBuilder } from './BaseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface TypeChildren {
  qualifier: QualifierBuilder;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens: Tokens, {get, ensure}: TokenMatcher): TypeNode {
    let qualifier = this.child.qualifier.visit(tokens);
    let generic = null;

    if (get.symbol('<')) {
      generic = this.visit(tokens);
      ensure.symbol('>');
    }

    let type = new TypeNode();
    type.qualifier = qualifier;
    type.generic = generic;

    return type;
  }
}
