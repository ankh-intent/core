
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
