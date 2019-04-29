import { Source } from '@intent/kernel/source/Source';
import { Token } from '@intent/kernel/parser/Token';
import { BaseTokenTypes, Context } from '@intent/kernel/parser/Tokenizer';
import { Range, TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { BuilderInvokers } from '@intent/kernel/transpiler/BaseBuilder';

export const AlchemyTokens = {
  ...BaseTokenTypes,
  TK_STRING: 'string',
  TK_IDENTIFIER: 'identifier',
  TK_NUMBER: 'number',
  TK_SYMBOL: 'symbol',
};

export class Alchemy {
  public static pure(context: Context) {
    let token;

    while ((token = this.tokenizer(context)) && (token.type === AlchemyTokens.TK_WHITESPACE)) {
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

export class AlchemyTokenMatcher extends TokenMatcher<typeof AlchemyTokens> {
  constructor(source: Source, range: Range) {
    super(Alchemy.pure.bind(Alchemy), AlchemyTokens, source, range);
  }
}

export interface AlchemyBuildInvokers extends BuilderInvokers<any, typeof AlchemyTokens> {

}
