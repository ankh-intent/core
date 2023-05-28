import { CoreConfig } from '../../CoreConfig';
import { StatEvent } from '../../kernel';

export class BaseStat {
    protected readonly config: CoreConfig;

    public constructor(config: CoreConfig) {
        this.config = config;
    }

    public process(event: StatEvent, data: any): StatEvent {
        return event;
    }
}
