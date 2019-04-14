
import { Token } from './Token';
import { Context, Tokenizer } from './Tokenizer';
import { SyntaxError } from './SyntaxError';
import { Source } from '../source/Source';
import { Strings } from '../../utils/Strings';
import { MatcherInterface, TokenMatcher } from './TokenMatcher';

export class Range {
  from: number;
  to: number;
}

export class Tokens {
  private readonly tokenizer: Tokenizer;
  private readonly context: Context;
  private readonly tokens: {[index: number]: Token} = {};
  private _matcher: TokenMatcher;
  private index: number;
  private last: number;

  public constructor(tokenizer: Tokenizer, source: Source, range: Range) {
    this.index = 0;
    this.last = range.from;
    this.context = {
      source,
      range,
      pos: range.from,
    };

    this.tokenizer = tokenizer;
  }

  public get source(): Source {
    return this.context.source;
  }

  public at(index: number): Token {
    let token = this.tokens[index];

    if (!token) {
      // todo: proper token resolving
      token = this.tokenizer(this.context);
      this.tokens[index] = token;
    }

    return token;
  }

  public peek(matcher: MatcherInterface): Token {
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

  public get(matcher: MatcherInterface): Token {
    const token = this.peek(matcher);

    if (token) {
      this.next();
    }

    return token;
  }

  public not(matcher: MatcherInterface): boolean {
    return !this.get(matcher);
  }

  public except(matcher: MatcherInterface): Token {
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
      const string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
      throw this.error(`Expected token with ${string}, but stream seems empty`);
    }

    const { value, type } = matcher;

    if (value && (token.value !== value)) {
      throw this.error(`Expected "${value}", but got "${token.value}"`);
    }

    if (type && (token.type !== type)) {
      throw this.error(`Expected @${type}, but got @${token.type}`);
    }

    this.next();

    return token;
  }

  public next() {
    this.index++;
  }

  public push(): number {
    return this.index;
  }

  public pop(mark: number): number {
    const old = this.index;
    this.index = mark;

    for (const i in this.tokens) {
      if ((+i) === mark) {
        this.context.pos = this.tokens[i].end;
      }

      if ((+i) > mark) {
        delete this.tokens[i];
      }
    }

    return old;
  }

  public error(reason: string, parent?: Error): SyntaxError {
    const error = new SyntaxError(reason, this.context.source, this.last);
    const stack = (error.stack || '').split('\n').slice(2);
    const commons = stack
      .map((line) => line.match(/at [^(]*\((.+?)(:\d+)*\)/))
      .filter((match) => match)
      .map((match) => match[1])
    ;
    const intersect = Strings.longestCommon(commons).map((line) => line.replace(/\/$/, ''));
    const max = Strings.max(stack.map((line) => line.replace(/(.*?)\s*\(.*/, '$1')));

    error.stack = stack.map((line) => {
      for (const idx in intersect) {
        const sub = intersect[idx];
        const com = Strings.longestCommon([
          sub,
          __filename.replace('/build/', '/')
        ]).pop();

        if (line.indexOf(com) >= 0) {
          return line
            .replace(/(.*?)\s*\(([^)]+)\)/, (m, ref, loc) => {
              return `${Strings.pad(ref, max, ' ')} (${loc})`;
            })
          ;
        }
      }

      return line;
    }).join('\n');
    error.parent = parent;

    return error;
  }

  public get matcher(): TokenMatcher {
    return this._matcher || (this._matcher = new TokenMatcher(this));
  }
}
