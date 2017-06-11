
import { BaseCoreEvent } from '../CoreEvent';
import { Chip } from '../../chips/Chip';

export interface InterpretedEventProps {
  content: string;
  chip: Chip;
}

export class InterpretedEvent extends BaseCoreEvent<InterpretedEventProps> {
}
