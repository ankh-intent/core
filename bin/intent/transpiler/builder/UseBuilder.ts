import { Tokens } from '~kernel/parser/Tokens';

import { UseNode } from '../ast/UseNode';
import { BaseBuilder } from './BaseBuilder';
import { QualifierBuilder } from './QualifierBuilder';

export interface UseChildren {
  qualifier: QualifierBuilder;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  public build(tokens: Tokens): UseNode {
    if (tokens.not({value: 'use'})) {
      return null;
    }

    let qualifier = this.child.qualifier.build(tokens);
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
