import { Source, Range } from '@intent/kernel/source';
import { Token, BaseTokenTypes, Context, TokenMatcher } from '@intent/kernel/parser';
import { BuilderInvokers } from '@intent/kernel/transpiler';

export class Alchemy {
  public static pure(context: Context, unpure?: boolean) {
    if (unpure) {
      return this.tokenizer(context);
    }

    let token;

    while ((token = this.tokenizer(context))) {
      if (token.type !== BaseTokenTypes.TK_WHITESPACE) {
        break;
      }
    }

    return token;
  }

  public static tokenizer(context: Context): Token|undefined {
    const was = context.pos;

    if (was >= context.range.to) {
      return;
    }

    const type = this.checkType(context.source, context);

    if (type) {
      return new Token(
        context.source,
        type,
        was,
        context.pos,
      );
    }
  }

  protected static checkType(source: Source, context: Context): string {
    const index = context.pos;
    const char = source.at(index);

    if (char.match(/['"`]/)) {
      const token = this.checkString(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/\s/)) {
      const token = this.checkWhitespace(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/[\w_]/i)) {
      const token = this.checkIdentifier(source, context);

      if (token) {
        return token;
      }
    }

    return this.checkSymbol(source, context);
  }

  protected static checkWhitespace(source: Source, context: Context): string|undefined {
    let index = context.pos;

    while (source.at(index).match(/\s/)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return BaseTokenTypes.TK_WHITESPACE;
    }
  }

  protected static checkString(source: Source, context: Context): string|undefined {
    let index = context.pos;
    const char = source.at(index++);

    if (!char.match(/['"`]/)) {
      return;
    }

    let at;

    while ((at = source.at(index)) && at !== char) {
      index++;
    }

    if ((index !== context.pos) && (at === char)) {
      context.pos = index + 1;

      return BaseTokenTypes.TK_STRING;
    }
  }

  protected static checkIdentifier(source: Source, context: Context): string|undefined {
    let index = context.pos;

    while (source.at(index).match(/[\w\d_]/i)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return BaseTokenTypes.TK_IDENTIFIER;
    }
  }
  //
  // numeric(context: Context): string {
  //
  // }
  //

  protected static checkSymbol(source: Source, context: Context): string {
    context.pos++;

    return BaseTokenTypes.TK_SYMBOL;
  }
}

export class AlchemyTokenMatcher extends TokenMatcher {
  constructor(source: Source, range: Range) {
    super(Alchemy.pure.bind(Alchemy), source, range);
  }
}

export interface AlchemyBuildInvokers extends BuilderInvokers<any> {

}
