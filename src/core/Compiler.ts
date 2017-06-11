
import { ASTBuilder } from './ASTBuilder';
import { Tokens } from './parser/Tokens';
import { Context, Intent } from './parser/Tokenizer';
import { Source } from './source/Source';

export class Compiler {
  private builder: ASTBuilder;

  public constructor(builder: ASTBuilder) {
    this.builder = builder;
  }

  public compile(source: Source) {
    let unwhitespace = (source: Source, context: Context) => {
      let token;

      while (token = Intent.wrapped(source, context)) {
        if (token.type !== 'whitespace') {
          break;
        }
      }

      return token;
    };

    return this.builder.chip(new Tokens(
      (context) => unwhitespace(source, context),
      source.range()
    ));
  }
}
