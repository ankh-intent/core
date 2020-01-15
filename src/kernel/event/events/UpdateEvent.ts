
import { BaseCoreEvent } from '../CoreEvent';

export interface UpdateEventProps {
  path: string;
  entry: string;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
