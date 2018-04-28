
import { Source } from './source/Source';
import { BaseCoreEvent } from '../../kernel/CoreEvent';

export interface ReadedEventProps {
  source: Source;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

