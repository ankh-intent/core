
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
    let was = context.pos;
    let type;

    if (was >= context.range.to) {
      return;
    }

    if (type = this.base(context.source, context)) {
      let token = new Token();
      token.source = context.source;
      token.start = was;
      token.end = context.pos;
      token.type = type;

      return token;
    }
  }

  public static base(source: Source, context: Context): string {
    let index = context.pos;
    let char = source.at(index);
    let token;

    switch (char) {
      case "\"":
        if (token = this.string(source, context)) {
          return token;
        }
    }

    if (char.match(/\s/)) {
      if (token = this.whitespace(source, context)) {
        return token;
      }
    }

    if (char.match(/[\w_]/i)) {
      if (token = this.identifier(source, context)) {
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
    let char = source.at(index++);

    if (char !== "\"") {
      return;
    }

    while (source.at(index) !== "\"") {
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
