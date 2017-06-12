
import { BaseCoreEvent, CoreEvent } from '../CoreEvent';

export interface UpdateEventProps {
  path: string;
  parent?: CoreEvent<any>,
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
