import { Tokens } from '@intent/kernel/parser/Tokens';

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

    const qualifier = this.child.qualifier.build(tokens);
    const alias = tokens.get({value: 'as'})
      ? tokens.ensure({type: 'identifier'}).value
      : qualifier.deepest();

    tokens.ensure({type: 'symbol', value: ';'});

    const use = new UseNode();
    use.qualifier = qualifier;
    use.alias = alias;

    return use;
  }
}
