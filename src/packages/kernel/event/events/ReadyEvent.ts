import { CoreEvent } from '../../interfaces';
import { BaseCoreEvent } from '../CoreEvent';
import { UpdateEventProps } from './UpdateEvent';

export interface EventChainInterface {
    start: Date;
    end: Date;
    original: CoreEvent<UpdateEventProps>[];
    monitored: CoreEvent<UpdateEventProps>[];
    accumulated: CoreEvent<UpdateEventProps>[];
}

export interface ReadyEventProps extends EventChainInterface {
}

export class ReadyEvent extends BaseCoreEvent<ReadyEventProps> {
}
