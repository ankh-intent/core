import { Source } from '@intent/kernel/source';
import { Token, BaseTokenTypes, Context, Range, TokenMatcher } from '@intent/kernel/parser';
import { BuilderInvokers } from '@intent/kernel/transpiler/BaseBuilder';

export class Intent {
  public static pure(context: Context) {
    let token: Token|undefined;

    while ((token = this.tokenizer(context))) {
      if ((token.type !== BaseTokenTypes.TK_WHITESPACE) && (token.type !== BaseTokenTypes.TK_COMMENT)) {
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
    const char = source.at(context.pos);

    if (char === '/') {
      const token = this.checkComment(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/^['"`]$/)) {
      const token = this.checkString(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/^\s$/)) {
      const token = this.checkWhitespace(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/^[\w_]$/i)) {
      const token = this.checkIdentifier(source, context);

      if (token) {
        return token;
      }
    }

    if (char.match(/^[\d]$/i)) {
      const token = this.checkNumeric(source, context);

      if (token) {
        return token;
      }
    }

    return this.checkSymbol(source, context);
  }

  protected static checkWhitespace(source: Source, context: Context): string|void {
    let index = context.pos;

    while (source.at(index).match(/^\s$/)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return BaseTokenTypes.TK_WHITESPACE;
    }
  }

  protected static checkString(source: Source, context: Context): string|void {
    let index = context.pos;
    const char = source.at(index++);

    if (!char.match(/^['"`]$/)) {
      return;
    }

    while (source.at(index) !== char) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index + 1;

      return BaseTokenTypes.TK_STRING;
    }
  }

  protected static checkIdentifier(source: Source, context: Context): string|void {
    let index = context.pos;

    while (source.at(index).match(/^[\w\d_]$/i)) {
      index++;
    }

    if (index !== context.pos) {
      context.pos = index;

      return BaseTokenTypes.TK_IDENTIFIER;
    }
  }

  protected static checkNumeric(source: Source, context: Context): string {
    let index = context.pos + 1;

    while (source.at(index).match(/^[\d]$/)) {
      index++;
    }

    if (source.at(index) === '.') {
      index++;

      while (source.at(index).match(/^[\d]$/)) {
        index++;
      }
    }

    if (source.at(index).match(/^[eE]$/)) {
      let digits = 0;
      let capture = index + 1;

      if (source.at(capture).match(/^[-+]$/)) {
        capture++;
      }

      while (source.at(capture).match(/^[\d]/)) {
        digits++;
        capture++;
      }

      if (digits) {
        index = capture;
      }
    }

    context.pos = index;

    return BaseTokenTypes.TK_NUMBER;
  }

  protected static checkSymbol(source: Source, context: Context): string {
    const first = source.at(context.pos);
    let index = context.pos + 1;

    switch (first) {
      case '!':
      case '=':
      case '>':
      case '<': {
        if (source.at(index) === '=') {
          index++;
        }

        break;
      }

      case '*': {
        if (source.at(index) === '*') {
          index++;
        }

        break;
      }
    }

    context.pos = index;

    return BaseTokenTypes.TK_SYMBOL;
  }

  protected static checkComment(source: Source, context: Context): string|void {
    let index = context.pos + 1;
    const second = source.at(index);

    switch (second) {
      case '/': {
        let char;

        while ((char = source.at(++index))) {
          if (char === '\n') {
            break;
          }
        }

        context.pos = index;

        return BaseTokenTypes.TK_COMMENT;
      }

      case '*': {
        let char;

        while ((char = source.at(++index))) {
          if ((char === '*') && (source.at(index + 1) === '/')) {
            index++;

            break;
          }
        }

        context.pos = index;

        return BaseTokenTypes.TK_COMMENT;
      }
    }
  }
}

export class IntentTokensMatcher extends TokenMatcher {
  constructor(source: Source, range: Range) {
    super(Intent.pure.bind(Intent), source, range);
  }
}

export interface IntentBuildInvokers extends BuilderInvokers<any> {

}
