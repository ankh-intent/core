
import { CoreEvent } from '../../kernel/CoreEvent';
import { AbstractConsumer } from '../../kernel/AbstractConsumer';

import { StatEvent } from '../../kernel/events/StatEvent';
import { CoreOptions } from '../../../Core';
import { CoreEventBus } from '../../kernel/CoreEventBus';
import { Logger } from '../../../intent-utils/Logger';
import { LogStat } from './LogStat';
import { EmittedStat } from './EmittedStat';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private logger: Logger;
  private processors: {
    log: LogStat;
    emitted: EmittedStat;
  };

  public constructor(bus: CoreEventBus, options: CoreOptions, logger: Logger) {
    super(bus);
    this.logger = logger;
    this.processors = {
      log: new LogStat(options, this.logger),
      emitted: new EmittedStat(options, this.logger),
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
