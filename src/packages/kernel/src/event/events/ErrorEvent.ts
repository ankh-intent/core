import { BaseCoreEvent } from '../CoreEvent';

export interface ErrorEventProps {
    error: any;
}

export class ErrorEvent extends BaseCoreEvent<ErrorEventProps> {
}
