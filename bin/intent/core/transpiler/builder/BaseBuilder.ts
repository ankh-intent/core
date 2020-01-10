import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { BaseTokenTypes } from '@intent/kernel/parser/Tokenizer';
import { TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel/parser/TokenMatcher';
import { BaseBuilder as Builder } from '@intent/kernel/transpiler/BaseBuilder';
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
