
export interface MatcherInterface {
  value?: string;
  type?: string;
}

export interface MatchInvoker<T> {
  (match?: MatcherInterface|string): T;
}

export interface TypeMatcherInterface<T> {
  [name: string]: MatchInvoker<T>;
}

export interface TokenMatcherInterface {
  peek: TypeMatcherInterface<Token>;
  get: TypeMatcherInterface<Token>;
  ensure: TypeMatcherInterface<Token>;
  not: TypeMatcherInterface<boolean>;
}

export class TokenMatcher implements TokenMatcherInterface {
  private tokens: Tokens;
  private _peek: TypeMatcherInterface<Token>;
  private _get: TypeMatcherInterface<Token>;
  private _ensure: TypeMatcherInterface<Token>;
  private _not: TypeMatcherInterface<boolean>;

  public constructor(tokens: Tokens) {
    this.tokens = tokens;
  }

  protected reconcile(base: MatcherInterface, match: MatcherInterface|string): MatcherInterface {
    if (typeof match === 'string') {
      match = {
        value: match,
      }
    }

    return Object.assign({}, base, match);
  }

  protected types<T>(method: (m: MatcherInterface|string) => T): TypeMatcherInterface<T> {
    let types = ['string', 'number', 'boolean', 'identifier', 'symbol', null];
    let result = {};

    for (let type of types) {
      let base = type ? {type: type} : null;

      result[type] = (match?: MatcherInterface|string) => {
        return method(
          (match && base)
            ? this.reconcile(base, match)
            : (base || {})
        );
      };
    }

    return result;
  }

  public get peek(): TypeMatcherInterface<Token> {
    return this._peek || (this._peek = this.types<Token>(
      this.tokens.peek.bind(this.tokens)
    ));
  }

  public get get(): TypeMatcherInterface<Token> {
    return this._get || (this._get = this.types<Token>(
      this.tokens.get.bind(this.tokens)
    ));
  }

  public get not(): TypeMatcherInterface<boolean> {
    return this._not || (this._not = this.types<boolean>(
      this.tokens.not.bind(this.tokens)
    ));
  }

  public get ensure(): TypeMatcherInterface<Token> {
    return this._ensure || (this._ensure = this.types<Token>(
      this.tokens.ensure.bind(this.tokens)
    ));
  }
}
