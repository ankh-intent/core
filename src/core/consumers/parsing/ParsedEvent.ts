
import { Source } from '../../kernel/source/Source';
import { BaseTokenTypes } from '../../kernel/parser/Tokenizer';
import { TokenMatcher } from '../../kernel/parser/TokenMatcher';
import { TypedMatcher } from '../../kernel/parser/TypedMatcher';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';

export interface ParsedEventProps<TT extends typeof BaseTokenTypes> {
  source: Source;
  tokens: TokenMatcher<TT>;
  matcher: TypedMatcher<TT>
}

export class ParsedEvent<TT extends typeof BaseTokenTypes> extends BaseCoreEvent<ParsedEventProps<TT>> {
}
