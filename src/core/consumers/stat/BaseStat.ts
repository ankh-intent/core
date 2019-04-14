
import { CoreConfig } from '../../Core';
import { StatEvent } from '../../kernel/event/events/StatEvent';

export class BaseStat {
  protected readonly config: CoreConfig;

  public constructor(config: CoreConfig) {
    this.config = config;
  }

  public process(event: StatEvent, data: any): StatEvent {
    return event;
  }
}
