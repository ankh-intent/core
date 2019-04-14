
import { Source } from '../../kernel/source/Source';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';

export interface ReadedEventProps {
  source: Source;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

