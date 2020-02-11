import { Source, Range } from '@intent/source';

import { SyntaxError } from './SyntaxError';
import { Token } from './Token';
import { BaseTokenTypes, Context, Tokenizer } from './Tokenizer';
import { TypedMatcher } from './TypedMatcher';

export interface MatcherInterface {
  value?: string;
  type?: string;
}

interface MatchInvoker<T> {
  (match?: MatcherInterface|string): T;
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

export type TypedTokenMatcherInterface<TT extends BaseTokenTypes = BaseTokenTypes> = {
  peek: TypeMatcherInterface<TT, string>;
  get: TypeMatcherInterface<TT, string>;
  except: TypeMatcherInterface<TT, string>;
  not: TypeMatcherInterface<TT, boolean>;
  ensure: TypeMatcherInterface<TT, string>;
}

export interface TokensFactory<TT extends BaseTokenTypes> {
  (source: Source): TokenMatcher<TT>;
}

const matcherToString = (matcher: MatcherInterface) => (
  Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ')
);

export class TokenMatcher<TT extends BaseTokenTypes = BaseTokenTypes, U = any> extends Enumerator<TT, U> {
  private readonly types: TT;
  private readonly context: Context;
  private readonly tokens: {[index: number]: Token} = {};
  private _matcher: TypedTokenMatcherInterface<TT>;
  private index: number;
  private last: number;

  public constructor(tokenizer: Tokenizer<TT>, source: Source, range: Range) {
    this.tokenizer = tokenizer;
    this.index = 0;
    this.last = range.from;
    this.context = {
      source,
      range,
      pos: range.from,
    };
  }

  public get source(): Source {
    return this.context.source;
  }

  public at(index: number, userData?: U): Token {
    let token = this.tokens[index];

    if (!token) {
      // todo: proper token resolving
      token = this.tokenizer(this.context, userData);
      this.tokens[index] = token;
    }

    return token;
  }

  public peek(matcher: MatcherInterface): Token|null {
    const { range: { to } } = this.context;

    if (this.index >= to) {
      return null;
    }

    const token = this.at(this.index + 1);
    this.last = token ? token.start : this.context.pos;

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
    const { range: { to } } = this.context;

    if (this.index >= to) {
      const string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
      throw this.error(`Unexpected end of stream, expected token with ${string}`);
    }

    const token = this.at(this.index + 1);

    if (!token) {
      throw this.error(`expect(${matcherToString(matcher)})`, `Expected token with ${matcherToString(matcher)}, but stream seems empty`);
    }

    const { value, type } = matcher;

    if (value && (token.value !== value)) {
      throw this.error(`expect(${value})`, `Expected "${value}", but got "${token.value}"`);
    }

    if (type && (token.type !== type)) {
      throw this.error(`@type(${type})`, `Expected @${type}, but got @${token.type}`);
    }

    this.next();

    return token;
  }

  public next() {
    this.index++;
  }

  public current(): number {
    return this.index;
  }

  public goto(index: number): number {
    const old = this.index;
    this.index = index;

    for (const i in this.tokens) {
      if ((+i) === index) {
        this.context.pos = this.tokens[i].end;
      }

      if ((+i) > index) {
        delete this.tokens[i];
      }
    }

    return old;
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

  get matcher() {
    return this._matcher || (this._matcher = new TypedMatcher(this.types, this));
  }
}
