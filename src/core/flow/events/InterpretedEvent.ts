
import { BaseCoreEvent } from '../CoreEvent';
import { Chip } from '../../chips/Chip';
import { Source } from '../../source/Source';

export interface InterpretedEventProps {
  content: Source;
  chip: Chip;
}

export class InterpretedEvent extends BaseCoreEvent<InterpretedEventProps> {
}
