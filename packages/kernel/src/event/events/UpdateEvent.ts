import { OriginInterface } from '@intent/source';
import { BaseCoreEvent } from '../CoreEvent';

export interface UpdateEventProps {
    event: 'add' | 'change' | 'unlink',
    path: string;
    entry: string;
    reference?: OriginInterface;
}

export class UpdateEvent extends BaseCoreEvent<UpdateEventProps> {
}
