
import { CoreConfig } from '../../CoreConfig';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { StatEvent } from '../../kernel/event/events/StatEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { Logger } from '../../utils';
import { LogStat } from './LogStat';
import { EmittedStat } from './EmittedStat';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private readonly logger: Logger;
  private readonly processors: {
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
    const stat = event.data.stat;
    const processor = this.processors[stat.type];

    return (
      processor
        ? processor.process(event, stat)
        : event
    );
  }
}
