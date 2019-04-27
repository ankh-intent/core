import { Context, Intent } from '@intent/kernel/parser/Tokenizer';
import { Range, Tokens } from '@intent/kernel/parser/Tokens';
import { Source } from '@intent/kernel/source/Source';

const intentTokenizer = (context: Context) => {
  let token;

  while ((token = Intent.wrapped(context))) {
    if (token.type !== 'whitespace') {
      break;
    }
  }

  return token;
};

export class IntentTokens extends Tokens {
  constructor(source: Source, range: Range) {
    super(intentTokenizer, source, range);
  }
}
