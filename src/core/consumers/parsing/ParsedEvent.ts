
import { Source } from '../reading/source/Source';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';
import { Tokens } from './parser/Tokens';

export interface ParsedEventProps {
  source: Source;
  tokens: Tokens;
}

export class ParsedEvent extends BaseCoreEvent<ParsedEventProps> {
}
