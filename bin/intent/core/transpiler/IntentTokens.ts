import { Token } from '@intent/kernel/parser/Token';
import { Context } from '@intent/kernel/parser/Tokenizer';
import { Range, Tokens } from '@intent/kernel/parser/Tokens';
import { Source } from '@intent/kernel/source/Source';

export class Intent {
  public static pure(context: Context) {
    let token;

    while ((token = this.tokenizer(context)) && (token.type === 'whitespace')) {
    }

    return token;
  }

  public static tokenizer(context: Context): Token {
    const was = context.pos;

    if (was >= context.range.to) {
      return;
    }

    const type = this.type(context.source, context);

    if (type) {
      return new Token(
        context.source,
        type,
        was,
        context.pos,
      );
    }
  }

  protected static type(source: Source, context: Context): string {
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

  protected static whitespace(source: Source, context: Context): string {
    let index = context.pos;

    while (source.at(index).match(/\s/)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return 'whitespace';
    }
  }

  protected static string(source: Source, context: Context): string {
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

  protected static identifier(source: Source, context: Context): string {
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

  protected static symbol(source: Source, context: Context): string {
    context.pos++;

    return 'symbol';
  }
}

export class IntentTokens extends Tokens {
  constructor(source: Source, range: Range) {
    super(Intent.pure.bind(Intent), source, range);
  }
}
