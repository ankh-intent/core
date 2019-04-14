
import { Token } from './Token';
import { Range } from './Tokens';
import { Source } from '../source/Source';

export interface Context {
  source: Source;
  range: Range;
  pos: number;
}

export interface Tokenizer {
  (context: Context): Token;
}

export class Intent {
  public static wrapped(context: Context): Token {
    const was = context.pos;

    if (was >= context.range.to) {
      return;
    }

    const type = this.base(context.source, context);

    if (type) {
      return new Token(
        context.source,
        type,
        was,
        context.pos,
      );
    }
  }

  public static base(source: Source, context: Context): string {
    const index = context.pos;
    const char = source.at(index);

    if (char.match(/['"`]/)) {
      const token = this.string(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/\s/)) {
      const token = this.whitespace(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/[\w_]/i)) {
      const token = this.identifier(source, context);

      if (token) {
        return token;
      }
    }

    return this.symbol(source, context);
  }

  public static whitespace(source: Source, context: Context): string {
    let index = context.pos;

    while (source.at(index).match(/\s/)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return 'whitespace';
    }
  }

  public static string(source: Source, context: Context): string {
    let index = context.pos;
    const char = source.at(index++);

    if (!char.match(/['"`]/)) {
      return;
    }

    while (source.at(index) !== char) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index + 1;

      return 'string';
    }
  }

  public static identifier(source: Source, context: Context): string {
    let index = context.pos;

    while (source.at(index).match(/[\w\d_]/i)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return 'identifier';
    }
  }
  //
  // numeric(context: Context): string {
  //
  // }
  //

  public static symbol(source: Source, context: Context): string {
    context.pos++;

    return 'symbol';
  }
}
