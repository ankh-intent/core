
import { Token } from './Token';
import { Context, Tokenizer } from './Tokenizer';
import { SyntaxError } from './SyntaxError';
import { Source } from '../source/Source';

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

  public ensure(matcher: Matcher): Token {
    let { range: { to } } = this.context;

    let reason = null;

    if (this.index >= to) {
      let string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
      reason = `Unexpected end of stream, expected token with ${string}`;
    } else {
      let token = this.at(this.index + 1);

      if (token) {
        let { value, type } = matcher;

        if (value && (token.value !== value)) {
          reason = `Expected "${value}", but got "${token.value}"`;
        } else {
          if (type && (token.type !== type)) {
            reason = `Expected @${type}, but got @${token.type}`;
          } else {
            this.next();

            return token;
          }
        }
      } else {
        let string = Object.keys(matcher).map((key) => `${key} "${matcher[key]}"`).join(', ');
        reason = `Expected token with ${string}, but stream seems empty`;
      }
    }

    throw new SyntaxError(reason, this.context.source, this.last);
  }

  public next() {
    this.index++;
  }
}

interface Matcher {
  value?: string;
  type?: string;
}
