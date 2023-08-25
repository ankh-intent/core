import { Token } from './Token';
import { BaseTokenTypes } from './Tokenizer';
import {
    MatcherInterface,
    TypedTokenMatcherInterface,
    TypeMatcherInterface,
    PeekTypeMatcherInterface,
    IsTypeMatcherInterface,
    TokenMatcher,
} from './TokenMatcher';

export class TypedMatcher<TT extends BaseTokenTypes = BaseTokenTypes> implements TypedTokenMatcherInterface<TT> {
    private readonly map: TT;
    private readonly matcher: TokenMatcher<TT>;
    private _peek: PeekTypeMatcherInterface<TT, string | null>;
    private _get: TypeMatcherInterface<TT, string | null>;
    private _ensure: TypeMatcherInterface<TT, string>;
    private _except: TypeMatcherInterface<TT, Token | null>;
    private _not: TypeMatcherInterface<TT, boolean>;
    private _is: IsTypeMatcherInterface<TT, boolean>;

    public constructor(map: TT, matcher: TokenMatcher<TT>) {
        this.map = map;
        this.matcher = matcher;
    }

    protected reconcile(base: MatcherInterface | null, match?: MatcherInterface | string): MatcherInterface {
        if (typeof match === 'string') {
            match = {
                value: match,
            };
        }

        return {
            type: match && match.type || base && base.type || undefined,
            value: match && match.value || base && base.value || undefined,
        };
    }

    protected types<T>(method: (m: MatcherInterface | string) => T, unwrap: boolean): TypeMatcherInterface<TT, T> {
        const result: TypeMatcherInterface<TT, T> = {} as any;

        for (const type of Object.values(BaseTokenTypes)) {
            const base = (type === BaseTokenTypes.TK_ANY) ? null : { type };

            result[type] = (match?: MatcherInterface | string) => {
                const matcher = this.reconcile(base, match);
                const matched: any = method(matcher);

                if (unwrap && matcher.type && matched?.type) {
                    return matched.value;
                }

                return matched;
            };
        }

        return result;
    }

    protected peekTypes<T>(method: (m: MatcherInterface | string, offset: number) => T): PeekTypeMatcherInterface<TT, T> {
        const result: TypeMatcherInterface<TT, T> = {} as any;

        for (const type of Object.values(BaseTokenTypes)) {
            const base = (type === BaseTokenTypes.TK_ANY) ? null : { type };

            result[type] = (match?: MatcherInterface | string, offset: number = 0) => {
                const matcher = this.reconcile(base, match);
                const matched: any = method(matcher, offset);

                if (matcher.type && matched && matched.type) {
                    return matched.value;
                }

                return matched;
            };
        }

        return result;
    }

    protected isTypes<T>(method: (token: Token, m: MatcherInterface | string) => T): IsTypeMatcherInterface<TT, T> {
        const result: TypeMatcherInterface<TT, T> = {} as any;

        for (const type of Object.values(BaseTokenTypes)) {
            const base = (type === BaseTokenTypes.TK_ANY) ? null : { type };

            result[type] = (token: Token, match?: MatcherInterface | string) => {
                return method(
                    token,
                    this.reconcile(base, match),
                );
            };
        }

        return result;
    }

    public get peek(): PeekTypeMatcherInterface<TT, string | null> {
        return this._peek || (this._peek = this.peekTypes(
            this.matcher.peek.bind(this.matcher),
        ));
    }

    public get get(): TypeMatcherInterface<TT, string | null> {
        return this._get || (this._get = this.types(
            this.matcher.get.bind(this.matcher),
            true,
        ));
    }

    public get except(): TypeMatcherInterface<TT, Token | null> {
        return this._except || (this._except = this.types(
            this.matcher.except.bind(this.matcher),
            false,
        ));
    }

    public get not(): TypeMatcherInterface<TT, boolean> {
        return this._not || (this._not = this.types(
            this.matcher.not.bind(this.matcher),
            false,
        ));
    }

    public get ensure(): TypeMatcherInterface<TT, string> {
        return this._ensure || (this._ensure = this.types(
            this.matcher.ensure.bind(this.matcher),
            true,
        ));
    }

    public get is(): IsTypeMatcherInterface<TT, boolean> {
        return this._is || (this._is = this.isTypes(
            this.matcher.is.bind(this.matcher),
        ));
    }
}
