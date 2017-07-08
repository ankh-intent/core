
import { Tokens } from '../../../parsing/parser/Tokens';
import { UseNode } from '../ast/UseNode';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';
import { QualifierNode } from '../ast/QualifierNode';

export interface UseChildren {
  qualifier: BuildInvoker<QualifierNode>;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): UseNode {
    if (not.identifier('use')) {
      return null;
    }

    let qualifier = this.child.qualifier(tokens);
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
