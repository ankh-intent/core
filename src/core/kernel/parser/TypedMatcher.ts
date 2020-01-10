import { Token } from './Token';
import { BaseTokenTypes } from './Tokenizer';
import { MatcherInterface, TypedTokenMatcherInterface, TypeMatcherInterface, TokenMatcher } from './TokenMatcher';

export class TypedMatcher<TT extends typeof BaseTokenTypes> implements TypedTokenMatcherInterface<TT> {
  private readonly map: TT;
  private readonly matcher: TokenMatcher<TT>;
  private _peek: TypeMatcherInterface<TT, Token>;
  private _get: TypeMatcherInterface<TT, Token>;
  private _ensure: TypeMatcherInterface<TT, Token>;
  private _except: TypeMatcherInterface<TT, Token>;
  private _not: TypeMatcherInterface<TT, boolean>;

  public constructor(map: TT, matcher: TokenMatcher<TT>) {
    this.map = map;
    this.matcher = matcher;
  }

  protected reconcile(base: MatcherInterface|null, match?: MatcherInterface|string): MatcherInterface {
    if (typeof match === 'string') {
      match = {
        value: match,
      };
    }

    return Object.assign({}, base, match);
  }

  protected types<T>(method: (m: MatcherInterface|string) => T): TypeMatcherInterface<TT, T> {
    const types = ['string', 'number', 'boolean', 'identifier', 'symbol', null];
    const result = {};

    for (const type of types) {
      const base = type ? { type } : null;

      result[type || 'any'] = (match?: MatcherInterface|string) => {
        return method(
          (match && base)
            ? this.reconcile(base, match)
            : (base || {})
        );
      };
    }

    return result;
  }

  public get peek(): TypeMatcherInterface<TT, Token> {
    return this._peek || (this._peek = this.types<Token>(
      this.matcher.peek.bind(this.matcher)
    ));
  }

  public get get(): TypeMatcherInterface<TT, Token> {
    return this._get || (this._get = this.types<Token>(
      this.matcher.get.bind(this.matcher)
    ));
  }

  public get except(): TypeMatcherInterface<TT, Token> {
    return this._except || (this._except = this.types<Token>(
      this.matcher.except.bind(this.matcher)
    ));
  }

  public get not(): TypeMatcherInterface<TT, boolean> {
    return this._not || (this._not = this.types<boolean>(
      this.matcher.not.bind(this.matcher)
    ));
  }

  public get ensure(): TypeMatcherInterface<TT, Token> {
    return this._ensure || (this._ensure = this.types<Token>(
      this.matcher.ensure.bind(this.matcher)
    ));
  }
}
