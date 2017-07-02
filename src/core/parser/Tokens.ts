
import { Token } from './Token';
import { Context, Tokenizer } from './Tokenizer';
import { SyntaxError } from './SyntaxError';
import { Source } from '../source/Source';
import { Strings } from '../../intent-utils/Strings';

export class Range {
  from: number;
  to: number;
}

export class Tokens {
  private index: number;
  private last: number;
  private tokenizer: Tokenizer;

  private context: Context;

  private tokens: {[index: number]: Token} = {};

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

  public at(index: number): Token {
    let token = this.tokens[index];

    if (!token) {
      // todo: proper token resolving
      token = this.tokenizer(this.context);
      this.tokens[index] = token;
    }

    this.last = token.start;

    return token;
  }

  public peek(matcher: Matcher): Token {
    let { range: { to } } = this.context;

    if (this.index >= to) {
      return null;
    }

    let token = this.at(this.index + 1);

    if (token) {
      let { value, type } = matcher;

      if (value && (token.value !== value)) {
        return null;
      }

      if (type && (token.type !== type)) {
        return null;
      }
    }

    return token;
  }

  public get(matcher: Matcher): Token {
    let token = this.peek(matcher);

    if (token) {
      this.next();
    }

    return token;
  }

  public not(matcher: Matcher): boolean {
    return !this.get(matcher);
  }

  public but(matcher: Matcher): Token {
    return this.peek(matcher)
      ? null
      : this.get({});
  }

  public ensure(matcher: Matcher): Token {
    let { range: { to } } = this.context;

    if (this.index >= to) {
      let string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
      throw this.error(`Unexpected end of stream, expected token with ${string}`);
    }

    let token = this.at(this.index + 1);

    if (!token) {
      let string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
      throw this.error(`Expected token with ${string}, but stream seems empty`);
    }

    let { value, type } = matcher;

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
    let old = this.index;
    this.index = mark;

    for (let i in this.tokens) {
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
    let error = new SyntaxError(reason, this.context.source, this.last);
    let stack = (error.stack || "").split("\n").slice(2);
    let commons = stack
      .map((line) => line.match(/at [^(]*\((.+?)(:\d+)*\)/))
      .filter((match) => match)
      .map((match) => match[1])
    ;
    let intersect = Strings.longestCommon(commons).map((line) => line.replace(/\/$/, ''));
    let max = Strings.max(stack.map((line) => line.replace(/(.*?)\s*\(.*/, '$1')));

    error.stack = stack.map((line) => {
      for (let idx in intersect) {
        let sub = intersect[idx];
        let com = Strings.longestCommon([
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
    }).join("\n");
    error.parent = parent;

    return error;
  }
}

interface Matcher {
  value?: string;
  type?: string;
}
