import { SourceInterface, BaseCoreEvent } from '@intent/kernel';

export interface ReadedEventProps {
    source: SourceInterface;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

