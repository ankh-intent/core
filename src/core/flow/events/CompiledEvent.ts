
import { BaseCoreEvent } from '../CoreEvent';
import { Chip } from '../../chips/Chip';

export interface CompiledEventProps {
  chip: Chip;
}

export class CompiledEvent extends BaseCoreEvent<CompiledEventProps> {
}
