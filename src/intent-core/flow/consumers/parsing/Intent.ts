
import { Context, Tokenizer } from '../../../parser/Tokenizer';
import { Token } from '../../../parser/Token';
import { Source } from '../../../source/Source';

export class Intent {
  public tokenizer(): Tokenizer {
    return (context: Context) => {
      let token;

      while (token = Intent.wrapped(context)) {
        if (token.type !== 'whitespace') {
          break;
        }
      }

      return token;
    }
  }

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

    if (char.match(/['"`]/)) {
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
    let char = source.at(index++), start = char;

    if (!char.match(/['"`]/)) {
      return;
    }

    while (source.at(index) !== start) {
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
