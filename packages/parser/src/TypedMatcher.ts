import { BaseTokenTypes } from './Tokenizer';
import { MatcherInterface, TypedTokenMatcherInterface, TypeMatcherInterface, TokenMatcher } from './TokenMatcher';

export class TypedMatcher<TT extends BaseTokenTypes = BaseTokenTypes> implements TypedTokenMatcherInterface<TT> {
  private readonly map: TT;
  private readonly matcher: TokenMatcher<TT>;
  private _peek: TypeMatcherInterface<TT, string>;
  private _get: TypeMatcherInterface<TT, string>;
  private _ensure: TypeMatcherInterface<TT, string>;
  private _except: TypeMatcherInterface<TT, string>;
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

    return (
      base
        ? Object.assign({}, base, match || {})
        : match || {}
    );
  }

  protected types<T>(method: (m: MatcherInterface|string) => T, unwrap: boolean): TypeMatcherInterface<TT, T> {
    const result: TypeMatcherInterface<TT, T> = {} as any;

    for (const type of Object.values(BaseTokenTypes)) {
      const base = (type === BaseTokenTypes.TK_ANY) ? null : { type };

      result[type] = (match?: MatcherInterface|string) => {
        const matcher = this.reconcile(base, match);
        const matched: any = method(matcher);

        if (unwrap && matcher.type && matched && matched.type) {
          return matched.value;
        }

        return matched;
      };
    }

    return result;
  }

  public get peek(): TypeMatcherInterface<TT, string> {
    return this._peek || (this._peek = this.types(
      this.matcher.peek.bind(this.matcher),
      true,
    ));
  }

  public get get(): TypeMatcherInterface<TT, string> {
    return this._get || (this._get = this.types(
      this.matcher.get.bind(this.matcher),
      true,
    ));
  }

  public get except(): TypeMatcherInterface<TT, string> {
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
}
