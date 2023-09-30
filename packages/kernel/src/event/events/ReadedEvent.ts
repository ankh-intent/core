import { SourceInterface } from '@intent/source';
import { BaseCoreEvent } from '../CoreEvent';

export interface ReadedEventProps {
    source: SourceInterface;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

