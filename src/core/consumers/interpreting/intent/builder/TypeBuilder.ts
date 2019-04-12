
import { Tokens } from '../../../parsing/parser/Tokens';
import { TypeNode } from '../ast/TypeNode';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { QualifierNode } from '../ast/QualifierNode';

export interface TypeChildren {
  qualifier: BuildInvoker<QualifierNode>;
}

export class TypeBuilder extends BaseBuilder<TypeNode, TypeChildren> {
  protected build(tokens: Tokens, {get, ensure}: TokenMatcher): TypeNode {
    let qualifier = this.child.qualifier(tokens);
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
