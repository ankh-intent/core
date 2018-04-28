
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { StatEvent } from '../../kernel/event/events/StatEvent';
import { CoreConfig } from '../../../Core';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { Logger } from '../../../intent-utils/Logger';
import { LogStat } from './LogStat';
import { EmittedStat } from './EmittedStat';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private logger: Logger;
  private processors: {
    log: LogStat;
    emitted: EmittedStat;
  };

  public constructor(bus: CoreEventBus, config: CoreConfig, logger: Logger) {
    super(bus);
    this.logger = logger;
    this.processors = {
      log: new LogStat(config, this.logger),
      emitted: new EmittedStat(config, this.logger),
    };
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === StatEvent.type();
  }

  public process(event: StatEvent) {
    let stat = event.data.stat;
    let processor = this.processors[stat.type];

    return (
      processor
        ? processor.process(event, stat)
        : event
    );
  }
}
