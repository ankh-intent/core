
import { CoreConfig } from '../../CoreConfig';
import { BaseStat } from './BaseStat';
import { Logger } from '../../utils/Logger';
import { StatEvent } from '../../kernel/event/events/StatEvent';

export class LogStat extends BaseStat {
  private readonly logger: Logger;

  public constructor(config: CoreConfig, logger: Logger) {
    super(config);
    this.logger = logger;
  }

  public process(event: StatEvent): StatEvent {
    const { data: { stat: { message } } } = event;

    for (const type of Object.keys(message)) {
      this.logger.log(Logger.strToLevel(type), event, message[type]);
    }

    return event;
  }
}
