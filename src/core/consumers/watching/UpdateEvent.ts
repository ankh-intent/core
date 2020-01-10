
import { BaseCoreEvent } from '../../kernel/event';

export interface UpdateEventProps {
  path: string;
  entry: string;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
