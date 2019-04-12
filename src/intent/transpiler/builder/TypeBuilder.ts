
import { Tokens } from '../../../core/consumers/parsing/parser/Tokens';
import { TypeNode } from '../ast/TypeNode';
import { QualifierBuilder } from './QualifierBuilder';
import { BaseBuilder } from './BaseBuilder';

export interface TypeChildren {
  qualifier: QualifierBuilder;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  build(tokens: Tokens): TypeNode {
    let qualifier = this.child.qualifier.build(tokens);
    let generic = null;

    if (tokens.get({type: 'symbol', value: '<'})) {
      generic = this.build(tokens);
      tokens.ensure({type: 'symbol', value: '>'});
    }

    let type = new TypeNode();
    type.qualifier = qualifier;
    type.generic = generic;

    return type;
  }
}
