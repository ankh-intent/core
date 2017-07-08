
import { Tokens } from '../../../parsing/parser/Tokens';
import { UseNode } from '../ast/UseNode';
import { BaseBuilder } from './BaseBuilder';
import { QualifierBuilder } from './QualifierBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface UseChildren {
  qualifier: QualifierBuilder;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): UseNode {
    if (tokens.not({value: 'use'})) {
      return null;
    }

    let qualifier = this.child.qualifier.visit(tokens);
    let alias = qualifier.deepest();

    if (tokens.get({value: 'as'})) {
      alias = tokens.ensure({type: 'identifier'}).value;
    }

    tokens.ensure({type: 'symbol', value: ';'});

    let use = new UseNode();
    use.qualifier = qualifier;
    use.alias = alias;

    return use;
  }
}
