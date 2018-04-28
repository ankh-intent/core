
import { BaseCoreEvent } from '../../kernel/CoreEvent';

export interface UpdateEventProps {
  path: string;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
