import { Source } from '@intent/source';

import { BaseCoreEvent } from '../../kernel';

export interface ReadedEventProps {
    source: Source;
}

export class ReadedEvent extends BaseCoreEvent<ReadedEventProps> {
}

