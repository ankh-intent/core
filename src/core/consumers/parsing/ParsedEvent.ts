
import { Source } from '../../kernel/source/Source';
import { BaseTokenTypes } from '../../kernel/parser/Tokenizer';
import { TokenMatcher } from '../../kernel/parser/TokenMatcher';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';

export interface ParsedEventProps<TT extends typeof BaseTokenTypes> {
  source: Source;
  tokens: TokenMatcher<TT>;
}

export class ParsedEvent<TT extends typeof BaseTokenTypes> extends BaseCoreEvent<ParsedEventProps<TT>> {
}
