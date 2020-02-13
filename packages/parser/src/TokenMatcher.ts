import { Source } from '@intent/source';

import { SyntaxError } from './SyntaxError';
import { Token } from './Token';
import { BaseTokenTypes } from './Tokenizer';
import { TypedMatcher } from './TypedMatcher';
import { Enumerator } from './Enumerator';

export interface MatcherInterface {
  value?: string;
  type?: string;
}

interface MatchInvoker<T> {
  (match?: MatcherInterface|string): T;
}

interface PeekMatchInvoker<T> {
  (match?: MatcherInterface|string, offset?: number): T;
}

interface IsMatchInvoker<T> {
  (token: Token, match?: MatcherInterface|string): T;
}

export interface TypeMatcherInterface<TT extends BaseTokenTypes, T> {
  any: MatchInvoker<Token>;
  symbol: MatchInvoker<T>;
  string: MatchInvoker<T>;
  number: MatchInvoker<T>;
  identifier: MatchInvoker<T>;
  comment: MatchInvoker<T>;
  whitespace: MatchInvoker<T>;
}
export interface PeekTypeMatcherInterface<TT extends BaseTokenTypes, T> {
  any: PeekMatchInvoker<Token>;
  symbol: PeekMatchInvoker<T>;
  string: PeekMatchInvoker<T>;
  number: PeekMatchInvoker<T>;
  identifier: PeekMatchInvoker<T>;
  comment: PeekMatchInvoker<T>;
  whitespace: PeekMatchInvoker<T>;
}
export interface IsTypeMatcherInterface<TT extends BaseTokenTypes, T> {
  any: IsMatchInvoker<Token>;
  symbol: IsMatchInvoker<T>;
  string: IsMatchInvoker<T>;
  number: IsMatchInvoker<T>;
  identifier: IsMatchInvoker<T>;
  comment: IsMatchInvoker<T>;
  whitespace: IsMatchInvoker<T>;
}

export type TypedTokenMatcherInterface<TT extends BaseTokenTypes = BaseTokenTypes> = {
  peek: PeekTypeMatcherInterface<TT, string|null>;
  get: TypeMatcherInterface<TT, string|null>;
  except: TypeMatcherInterface<TT, Token|null>;
  not: TypeMatcherInterface<TT, boolean>;
  ensure: TypeMatcherInterface<TT, string>;
  is: IsTypeMatcherInterface<TT, boolean>;
}

export interface TokensFactory<TT extends BaseTokenTypes> {
  (source: Source): TokenMatcher<TT>;
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
  private readonly types: TT;
  private _matcher: TypedTokenMatcherInterface<TT>;

  public peek(matcher: MatcherInterface, offset: number = 0): Token|null {
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

  public get(matcher: MatcherInterface): Token|null {
    const token = this.peek(matcher);

    if (token) {
      this.next();
    }

    return token;
  }

  public not(matcher: MatcherInterface): boolean {
    return !this.get(matcher);
  }

  public except(matcher: MatcherInterface): Token|null {
    return this.peek(matcher)
      ? null
      : this.get({});
  }

  public ensure(matcher: MatcherInterface): Token {
    const token = this.at(this.current() + 1);

    if (!token) {
      throw this.error(`expect(${matcherToString(matcher)})`, `Expected token with ${matcherToString(matcher)}, but stream seems empty`);
    }

    const { value, type } = matcher;

    if (type && (token.type !== type)) {
      throw this.error(`@type(${type})`, `Expected @${type}, but got @${token.type}`);
    }

    if (value && (token.value !== value)) {
      throw this.error(`expect("${value}")`, `Expected "${value}", but got "${token.value}"`);
    }

    this.next();

    return token;
  }

  public is(matcher: MatcherInterface, token: Token): Token|false {
    const { value, type } = matcher;

    if (type && (token.type !== type)) {
      return false;
    }

    if (value && (token.value !== value)) {
      return false;
    }

    return token;
  }

  public error(expectation: string, reason: string, parent?: Error): SyntaxError {
    return new SyntaxError(
      reason,
      expectation,
      this.source,
      this.last,
      parent,
    );
  }

  get matcher(): TypedTokenMatcherInterface<TT> {
    return this._matcher || (this._matcher = new TypedMatcher(this.types, this));
  }
}
