import { Source, Range } from '@intent/source';
import { Token } from './Token';
import { BaseTokenTypes, Context, Tokenizer } from './Tokenizer';

export class Enumerator<TT extends BaseTokenTypes, U> {
  private readonly tokenizer: Tokenizer<TT, U>;
  private readonly tokens = new Map<number, Token>();

  private readonly context: Context;
  private tokenized: number = -1;
  private currentIndex: number;
  private lasts: {[index: number]: number} = {};

  public constructor(tokenizer: Tokenizer<TT>, source: Source, range: Range) {
    this.tokenizer = tokenizer;
    this.currentIndex = -1;
    this.lasts[-1] = range.from;
    this.context = {
      source,
      range,
      pos: range.from,
    };
  }

  public get source(): Source {
    return this.context.source;
  }

  public get last(): number {
    return this.lasts[this.currentIndex+1] || this.context.range.from;
  }

  public at(index: number, userData?: any): Token | null {
    let token = this.tokens.get(index);

    if (!token) {
      if (this.context.pos > this.context.range.to) {
        return null;
      }

      while (this.tokenized < index) {
        token = this.tokenizer(this.context, userData);

        if (token) {
          this.tokenized++;
          this.tokens.set(this.tokenized, token);
          this.lasts[this.tokenized] = token.start;
        } else {
          break;
        }
      }
    }

    return token || null;
  }

  public next() {
    this.currentIndex++;
  }

  public current(): number {
    return this.currentIndex;
  }

  public goto(index: number): number {
    const old = this.currentIndex;

    if (index >= 0) {
      const token = this.at(index);

      if (!token) {
        throw new Error(`Can't navigate to token #${index}`);
      }
    }

    this.currentIndex = index;

    return old;
  }
}
