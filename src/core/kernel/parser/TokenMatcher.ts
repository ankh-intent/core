import { Token } from './Token';
import { Tokens } from './Tokens';

export interface MatcherInterface {
  value?: string;
  type?: string;
}

export interface MatchInvoker<T> {
  (match?: MatcherInterface|string): T;
}

type TokenTypes = 'string' | 'number' | 'boolean' | 'symbol' | 'identifier' | 'eof' | 'any';

export type TypeMatcherInterface<T> = {
  [name in TokenTypes]?: MatchInvoker<T>;
}

export interface TokenMatcherInterface {
  peek: TypeMatcherInterface<Token>;
  get: TypeMatcherInterface<Token>;
  except: TypeMatcherInterface<Token>;
  not: TypeMatcherInterface<boolean>;
  ensure: TypeMatcherInterface<Token>;
}

export class TokenMatcher implements TokenMatcherInterface {
  private readonly tokens: Tokens;
  private _peek: TypeMatcherInterface<Token>;
  private _get: TypeMatcherInterface<Token>;
  private _ensure: TypeMatcherInterface<Token>;
  private _except: TypeMatcherInterface<Token>;
  private _not: TypeMatcherInterface<boolean>;

  public constructor(tokens: Tokens) {
    this.tokens = tokens;
  }

  protected reconcile(base: MatcherInterface, match: MatcherInterface|string): MatcherInterface {
    if (typeof match === 'string') {
      match = {
        value: match,
      };
    }

    return Object.assign({}, base, match);
  }

  protected types<T>(method: (m: MatcherInterface|string) => T): TypeMatcherInterface<T> {
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

  public get except(): TypeMatcherInterface<Token> {
    return this._except || (this._except = this.types<Token>(
      this.tokens.except.bind(this.tokens)
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
