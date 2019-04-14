import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { UseNode } from '../ast/UseNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { QualifierNode } from '../ast/QualifierNode';

export interface UseChildren extends BuilderInvokers<any> {
  qualifier: BuildInvoker<QualifierNode>;
}

export class UseBuilder extends BaseBuilder<UseNode, UseChildren> {
  protected build(tokens: Tokens, {not, get, ensure}: TokenMatcher): UseNode {
    if (not.identifier('use')) {
      return null;
    }

    const qualifier = this.child.qualifier(tokens);
    const alias = get.identifier('as')
      ? ensure.identifier().value
      : qualifier.deepest();

    ensure.symbol(';');

    return new UseNode(
      qualifier,
      alias,
    );
  }
}
