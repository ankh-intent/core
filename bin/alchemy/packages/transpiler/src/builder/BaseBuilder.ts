import { Container } from '@intent/kernel';
import { BaseTokenTypes, TokenMatcher, TypedTokenMatcherInterface } from '@intent/kernel';
import { TreeNode, BaseBuilder as Builder, BuilderInvokers } from '@intent/kernel';

export const enum Markers {
    ABSTRACT = 'IS_ABSTRACT',
    NATIVE = 'IS_NATIVE',
    FUNCTOR = 'IS_FUNCTOR',
    ASSIGNMENT = 'IS_ASSIGNMENT',
}

export abstract class BaseBuilder<
    N extends TreeNode,
    I extends Container<TreeNode>,
    TT extends BaseTokenTypes = BaseTokenTypes,
>
    extends Builder<TT, N, BuilderInvokers<I, TT>>
{
    protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N | null;

    public setNative(tokens: TokenMatcher) {
        tokens.mark(Markers.NATIVE);
    }

    public setAbstract(tokens: TokenMatcher) {
        tokens.mark(Markers.ABSTRACT);
    }

    public notAbstract(tokens: TokenMatcher): boolean {
        return tokens.has(Markers.ABSTRACT) < 0;
    }

    public setAssignment(tokens: TokenMatcher) {
        tokens.mark(Markers.ASSIGNMENT);
    }

    public setFunctor(tokens: TokenMatcher) {
        tokens.mark(Markers.FUNCTOR);
    }

    public not(tokens: TokenMatcher, marker: any): boolean {
        return tokens.has(marker) < 0;
    }

    public is(tokens: TokenMatcher, marker: any): boolean {
        return tokens.has(marker) >= 0;
    }
}
