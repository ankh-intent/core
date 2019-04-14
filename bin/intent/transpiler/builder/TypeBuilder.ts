import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { TypeNode } from '../ast/TypeNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { QualifierNode } from '../ast/QualifierNode';

export interface TypeChildren extends BuilderInvokers<any> {
  qualifier: BuildInvoker<QualifierNode>;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens: Tokens, {get, ensure}: TokenMatcher): TypeNode {
    const qualifier = this.child.qualifier(tokens);
    let generic = null;

    if (get.symbol('<')) {
      generic = this.visit(tokens);
      ensure.symbol('>');
    }

    return new TypeNode(
      qualifier,
      generic,
    );
  }
}
