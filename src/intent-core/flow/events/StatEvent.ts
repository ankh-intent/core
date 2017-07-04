
import { BaseCoreEvent, CoreEvent } from '../CoreEvent';

export interface StatEventProps {
  stat: any;
  parent?: CoreEvent<any>;
}

export class StatEvent extends BaseCoreEvent<StatEventProps> {
}
