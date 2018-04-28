
import { BaseStat } from './BaseStat';
import { Logger } from '../../../intent-utils/Logger';
import { CoreConfig } from '../../../Core';
import { StatEvent } from '../../kernel/event/events/StatEvent';

export class LogStat extends BaseStat {
  private logger: Logger;

  public constructor(config: CoreConfig, logger: Logger) {
    super(config);
    this.logger = logger;
  }

  public process(event: StatEvent): StatEvent {
    let { data: { stat: { message } } } = event;

    for (let type of Object.keys(message)) {
      this.logger.log(Logger.strToLevel(type), event, message[type]);
    }

    return event;
  }
}
