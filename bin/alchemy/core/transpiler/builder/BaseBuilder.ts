import { BaseTokenTypes, TokenMatcher, TypedTokenMatcherInterface } from '@intent/parser';
import { TreeNode } from '@intent/kernel/ast';
import { BaseBuilder as Builder } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';

export abstract class BaseBuilder<
  N extends TreeNode,
  I extends AlchemyBuildInvokers,
  TT extends BaseTokenTypes = BaseTokenTypes,
>
  extends Builder<TT, N, I>
{
  protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N|null
}
