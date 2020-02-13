
import { BaseCoreEvent, CoreEvent } from '../CoreEvent';

export interface StatEventProps {
  stat: any;
  parent?: CoreEvent;
}

export class StatEvent extends BaseCoreEvent<StatEventProps> {
}
