import { Strings, Container } from '@intent/utils';
import { RegionInterface, Region } from '@intent/source';
import {
    Token,
    BaseTokenTypes,
    TokenMatcher,
    SyntaxError,
    TypedTokenMatcherInterface,
    TokenizedLookup,
} from '@intent/parser';

import { TreeNode, TokenVisitor } from '@intent/ast';

export interface BuildInvoker<N extends TreeNode, TT extends BaseTokenTypes = any> extends TokenizedLookup<N, TT> {}

export type BuilderInvokers<T extends Container<TreeNode>, TT extends BaseTokenTypes = BaseTokenTypes> = {
    [name in keyof T]: BuildInvoker<T[name], TT>;
}

export abstract class BaseBuilder<
    TT extends BaseTokenTypes,
    N extends TreeNode,
    I extends BuilderInvokers<any, TT>,
> implements TokenVisitor<N, TT> {
    protected child: I;

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(builders: I) {
        this.child = builders;
    }

    protected get name(): string {
        return Strings.camelCaseToSnakeCase(
            this.constructor.name.replace(/Builder$/, ''),
        );
    }

    public visit(tokens: TokenMatcher<TT>): N | null {
        const index = tokens.current();
        const state = tokens.pushState();

        try {
            const node: N | null = this.build(tokens, tokens.matcher);

            if (node) {
                node.astRegion = this.narrowRegion(tokens, index);
            } else {
                tokens.goto(index);
            }

            tokens.popState(state);

            return node;
        } catch (e) {
            tokens.goto(index);

            throw this.error(tokens, this.name, `Failed @${this.name}`, e);
        }
    }

    protected narrowRegion(tokens: TokenMatcher<TT>, start: number, end?: number): RegionInterface {
        const source = tokens.source;
        const current = tokens.current();
        const before = this.seek(tokens, start, +1);
        const after = (current !== start) && this.seek(tokens, end ?? current + 1, -1);

        const from = before ? before.start : 0;
        const to = after ? after.end : from;

        return new Region(
            source.location(from),
            source.location(to),
        );
    }

    protected seek(tokens: TokenMatcher<TT>, start: number, delta: number): Token<TT> | null {
        let token: Token<TT> | null = null;

        do {
            start += delta;
            token = tokens.at(start, true);
        } while (token?.type === BaseTokenTypes.TK_WHITESPACE);

        return token;
    }

    public error(tokens: TokenMatcher<TT>, expectation: string | TreeNode, reason: string, parent?: Error): SyntaxError {
        if (typeof expectation !== 'string') {
            return new SyntaxError(
                reason,
                expectation.node,
                expectation.astRegion.positional,
                parent,
            );
        }

        return tokens.error(expectation, reason, parent);
    }

    protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N | null;
}
