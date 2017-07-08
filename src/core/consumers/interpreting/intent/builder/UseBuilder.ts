
import { Tokens } from '../../../parsing/parser/Tokens';
import { UseNode } from '../ast/UseNode';
import { BaseBuilder } from './BaseBuilder';
import { QualifierBuilder } from './QualifierBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface UseChildren {
  qualifier: QualifierBuilder;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): UseNode {
    if (not.identifier('use')) {
      return null;
    }

    let qualifier = this.child.qualifier.visit(tokens);
    let alias = qualifier.deepest();

    if (get.identifier('as')) {
      alias = ensure.identifier().value;
    }

    ensure.symbol(';');

    let use = new UseNode();
    use.qualifier = qualifier;
    use.alias = alias;

    return use;
  }
}
