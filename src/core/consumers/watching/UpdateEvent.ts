
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';

export interface UpdateEventProps {
  path: string;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
