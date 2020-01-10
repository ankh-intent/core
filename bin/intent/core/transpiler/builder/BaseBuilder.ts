import { TreeNode } from '@intent/kernel/ast';
import { BaseTokenTypes, TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel/parser';
import { BaseBuilder as Builder } from '@intent/kernel/transpiler';

import { IntentBuildInvokers } from '../Intent';

export abstract class BaseBuilder<
  N extends TreeNode,
  I extends IntentBuildInvokers,
  TT extends BaseTokenTypes = BaseTokenTypes,
>
  extends Builder<TT, N, I>
{
  protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N|null
}
