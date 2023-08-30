import { SourceInterface } from '@intent/source';

import { SyntaxError } from './SyntaxError';
import { Token } from './Token';
import { BaseTokenTypes } from './Tokenizer';
import { TypedMatcher } from './TypedMatcher';
import { Enumerator } from './Enumerator';

export interface MatcherInterface<TT extends BaseTokenTypes = BaseTokenTypes> {
    value?: string;
    type?: TT;
}

interface MatchInvoker<T, M> {
    (match?: M): T;
}

interface PeekMatchInvoker<T, M> {
    (match?: M, offset?: number): T;
}

interface IsMatchInvoker<TT extends BaseTokenTypes, T, M> {
    (token: Token<TT>, match?: M): T;
}

type AnyRecord<TT extends BaseTokenTypes, Type, AnyType> = {
    [BaseTokenTypes.TK_ANY]: AnyType;
    [BaseTokenTypes.TK_WHITESPACE]: Type;
    [BaseTokenTypes.TK_COMMENT]: Type;
    [BaseTokenTypes.TK_STRING]: Type;
    [BaseTokenTypes.TK_IDENTIFIER]: Type;
    [BaseTokenTypes.TK_NUMBER]: Type;
    [BaseTokenTypes.TK_SYMBOL]: Type;
};

export type TypeMatcherInterface<TT extends BaseTokenTypes, T> = AnyRecord<
    TT,
    MatchInvoker<T, string>,
    MatchInvoker<Token<TT>, MatcherInterface<TT> | string>
>;

export type PeekTypeMatcherInterface<TT extends BaseTokenTypes, T> = AnyRecord<
    TT,
    PeekMatchInvoker<T, string>,
    PeekMatchInvoker<Token<TT>, MatcherInterface<TT> | string>
>;

export type IsTypeMatcherInterface<TT extends BaseTokenTypes, T> = AnyRecord<
    TT,
    IsMatchInvoker<TT, T, string>,
    IsMatchInvoker<TT, Token<TT>, MatcherInterface<TT> | string>
>;

export type TypedTokenMatcherInterface<TT extends BaseTokenTypes = BaseTokenTypes> = {
    peek: PeekTypeMatcherInterface<TT, string | null>;
    get: TypeMatcherInterface<TT, string | null>;
    except: TypeMatcherInterface<TT, Token<TT> | null>;
    not: TypeMatcherInterface<TT, boolean>;
    ensure: TypeMatcherInterface<TT, string>;
    is: IsTypeMatcherInterface<TT, boolean>;
}

export interface TokensFactory<TT extends BaseTokenTypes> {
    (source: SourceInterface): TokenMatcher<TT>;
}

const matcherToString = (matcher: MatcherInterface) => {
    if (matcher.type && !matcher.value) {
        return `@${matcher.type}()`;
    }

    if (matcher.value && !matcher.type) {
        return `"${matcher.value}"`;
    }

    if (!(matcher.type || matcher.value)) {
        return '<any>';
    }

    return `@${matcher.type}("${matcher.value}")`;
};

export class TokenMatcher<TT extends BaseTokenTypes = BaseTokenTypes, U = any> extends Enumerator<TT, U> {
    protected readonly types: TT[];
    private _matcher: TypedTokenMatcherInterface<TT>;

    public peek(matcher: MatcherInterface<TT>, offset: number = 0): Token<TT> | null {
        const token = this.at(this.current() + offset + 1);

        if (token) {
            const { value, type } = matcher;

            if (value && (token.value !== value)) {
                return null;
            }

            if (type && (token.type !== type)) {
                return null;
            }
        }

        return token;
    }

    public get(matcher: MatcherInterface<TT>): Token<TT> | null {
        const token = this.peek(matcher);

        if (token) {
            this.next();
        }

        return token;
    }

    public not(matcher: MatcherInterface<TT>): boolean {
        return !this.get(matcher);
    }

    public except(matcher: MatcherInterface<TT>): Token<TT> | null {
        return this.peek(matcher)
            ? null
            : this.get({});
    }

    public ensure(matcher: MatcherInterface<TT>): Token<TT> {
        const token = this.at(this.current() + 1);

        if (!token) {
            throw this.error(
                `expect(${matcherToString(matcher)})`,
                `Expected token with ${matcherToString(matcher)}, but stream seems empty`
            );
        }

        const { value, type } = matcher;

        if (type && (token.type !== type)) {
            throw this.error(matcherToString(matcher), `Expected @${type}, but got @${token.type}`);
        }

        if (value && (token.value !== value)) {
            throw this.error(matcherToString(matcher), `Expected "${value}", but got "${token.value}"`);
        }

        this.next();

        return token;
    }

    public is(matcher: MatcherInterface<TT>, token: Token<TT>): Token<TT> | false {
        const { value, type } = matcher;

        if (type && (token.type !== type)) {
            return false;
        }

        if (value && (token.value !== value)) {
            return false;
        }

        return token;
    }

    public error(expectation: string, message: string, parent?: Error): SyntaxError {
        return new SyntaxError(
            message,
            expectation,
            this.source.positional(this.last),
            parent,
        );
    }

    get matcher(): TypedTokenMatcherInterface<TT> {
        return this._matcher || (this._matcher = new TypedMatcher(this.types, this));
    }
}
