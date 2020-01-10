
import { Token } from './Token';
import { Range } from './TokenMatcher';
import { Source } from '../source/Source';

export enum BaseTokenTypes {
  TK_ANY = 'any',
  TK_WHITESPACE = 'whitespace',
  TK_COMMENT = 'comment',
  TK_STRING = 'string',
  TK_IDENTIFIER = 'identifier',
  TK_NUMBER = 'number',
  TK_SYMBOL = 'symbol',
  TK_EOF = 'eof',
}

export interface Context {
  source: Source;
  range: Range;
  pos: number;
}

export interface Tokenizer<TT extends typeof BaseTokenTypes> {
  (context: Context): Token;
}
