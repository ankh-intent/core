
import { Source } from '@intent/source';

import { BaseTokenTypes, TokenMatcher } from '../../kernel/parser';
import { BaseCoreEvent } from '../../kernel/event';

export interface ParsedEventProps<TT extends BaseTokenTypes> {
  source: Source;
  tokens: TokenMatcher<TT>;
}

export class ParsedEvent<TT extends BaseTokenTypes> extends BaseCoreEvent<ParsedEventProps<TT>> {
}
