import { Container } from '@intent/utils';
import { BaseTokenTypes, TokenMatcher, TypedTokenMatcherInterface } from '@intent/parser';
import { TreeNode, BaseBuilder as Builder, BuilderInvokers } from '@intent/kernel';

export abstract class BaseBuilder<
    N extends TreeNode,
    I extends Container<TreeNode>,
    TT extends BaseTokenTypes = BaseTokenTypes,
>
    extends Builder<TT, N, BuilderInvokers<I, TT>>
{
    protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N | null
}
