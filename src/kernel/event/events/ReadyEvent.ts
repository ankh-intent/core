import { BaseCoreEvent } from '../CoreEvent';
import { UpdateEvent } from './UpdateEvent';

export interface EventChainInterface {
  start: Date;
  end: Date;
  original: UpdateEvent[];
  monitored: UpdateEvent[];
  accumulated: UpdateEvent[];
}

export interface ReadyEventProps extends EventChainInterface {
}

export class ReadyEvent extends BaseCoreEvent<ReadyEventProps> {
}
