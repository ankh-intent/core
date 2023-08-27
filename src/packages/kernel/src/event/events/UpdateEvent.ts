import { BaseCoreEvent } from '../CoreEvent';

export interface UpdateEventProps {
    event: 'add' | 'change' | 'unlink',
    path: string;
    entry: string;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
