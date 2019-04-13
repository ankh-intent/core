import { Tokens } from '@intent/kernel/parser/Tokens';

import { TypeNode } from '../ast/TypeNode';
import { QualifierBuilder } from './QualifierBuilder';
import { BaseBuilder } from './BaseBuilder';

export interface TypeChildren {
  qualifier: QualifierBuilder;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  visit(tokens: Tokens): TypeNode {
    const qualifier = this.child.qualifier.visit(tokens);
    let generic = null;

    if (tokens.get({type: 'symbol', value: '<'})) {
      generic = this.visit(tokens);
      tokens.ensure({type: 'symbol', value: '>'});
    }

    const type = new TypeNode();
    type.qualifier = qualifier;
    type.generic = generic;

    return type;
  }
}
