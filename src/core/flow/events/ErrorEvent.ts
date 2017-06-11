
import { BaseCoreEvent, CoreEvent } from '../CoreEvent';

export interface ErrorEventProps {
  error: any;
  parent?: CoreEvent<any>;
}

export class ErrorEvent extends BaseCoreEvent<ErrorEventProps> {
}
