
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { StatEvent } from '../events/StatEvent';
import { CoreOptions } from '../../../Core';
import { CoreEventBus } from '../CoreEventBus';
import { Strings } from "../../../intent-utils/Strings";
import { Source } from '../../source/Source';
import { Logger } from '../../../intent-utils/Logger';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private options: CoreOptions;
  private logger: Logger;
  private processors: {
    log: LogStat;
    emitted: EmittedStat;
  };

  public constructor(bus: CoreEventBus, options: CoreOptions, logger: Logger) {
    super(bus);
    this.options = options;
    this.logger = logger;
    this.processors = {
      log: new LogStat(this, options, this.logger),
      emitted: new EmittedStat(this, options),
    };
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === StatEvent.type();
  }

  public process(event: StatEvent) {
    let stat = event.data.stat;

    if (this.processors[stat.type]) {
      return this.processors[stat.type].process(event, stat);
    }
  }
}

class BaseStat {
  protected consumer: StatConsumer;
  protected options: CoreOptions;

  public constructor(consumer: StatConsumer, options: CoreOptions) {
    this.consumer = consumer;
    this.options = options;
  }

  public process(event: StatEvent, data: any) {
  }
}

class LogStat extends BaseStat {
  private logger: Logger;

  public constructor(consumer: StatConsumer, options: CoreOptions, logger: Logger) {
    super(consumer, options);
    this.logger = logger;
  }

  public process(event: StatEvent) {
    let { data: { stat: { message } } } = event;

    for (let type of Object.keys(message)) {
      this.logger.log(Logger.strToLevel(type), event, message[type]);
    }
  }
}

class EmittedStat extends BaseStat {
  public process(event: StatEvent, { chip, index, source, start, end }) {
    let path = (<Source>source).reference;
    let common = Strings.longestCommon([
      path,
      this.options.resolver.paths.project,
      this.options.resolver.paths.intent
    ]).pop();
    let cause = '<root>';
    let parent: CoreEvent<any> = event;

    while (parent) {
      parent = parent.parent;

      if (parent) {
        let data: any = parent.data;

        if (data.chip && (data.chip !== chip)) {
          cause = data.chip.name;
          break;
        }
      }
    }

    let indexS = Strings.pad(String(index), 5, ' ', true);
    let causeS = Strings.shrink(cause, 10, true);
    let pathS  = Strings.shrink(path.replace(new RegExp(`^${common}`), '@'), 60);
    let timeS  = Strings.shrink(`~${String(end - start)}`, 6, true);

    this.consumer.stat(event, {
      type: 'log',
      message: {
        log:
          `${indexS} [${causeS}] ${pathS} ${timeS} ms`,
      },
    });
  }
}
