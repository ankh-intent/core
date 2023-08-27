import { SourceInterface } from '@intent/source';
import { BaseCoreEvent } from '@intent/kernel';

export interface ReadedEventProps {
    source: SourceInterface;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

