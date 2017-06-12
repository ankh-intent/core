
import { BaseCoreEvent, CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { StatEvent } from '../events/StatEvent';
import { CoreOptions } from '../../../Core';
import { CoreEventBus } from '../CoreEventBus';
import { Strings } from "../../../intent-utils/Strings";
import { Source } from '../../source/Source';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{
  private options: CoreOptions;
  private logger;
  private processors: {
    ready: ReadyStat;
    emitted: EmittedStat;
  };

  public constructor(bus: CoreEventBus, options: CoreOptions) {
    super(bus);
    this.options = options;
    this.logger = new Logger();
    this.processors = {
      ready: new ReadyStat(this, this.logger, options),
      emitted: new EmittedStat(this, this.logger, options),
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
  protected logger: Logger;

  public constructor(consumer: StatConsumer, logger: Logger, options: CoreOptions) {
    this.consumer = consumer;
    this.logger = logger;
    this.options = options;
  }

  public process(event: StatEvent, data: any) {
  }
}

class ReadyStat extends BaseStat {
  public process(event: StatEvent) {
    if (this.options.watch) {
      this.logger.log(event, 'Watching...');
    }
  }
}

class EmittedStat extends BaseStat {
  public process(event: StatEvent, { chip, index, content, start, end }) {
    let path = (<Source>content).reference;
    let common = Strings.longestCommon([
      path,
      this.options.resolver.paths.project,
      this.options.resolver.paths.intent
    ]).pop();
    let cause = '<root>';
    let parent = event;

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

    this.logger.log(
      `${Strings.pad(String(index), 5, ' ', true)} ` +
      `[${Strings.pad(cause, 10, ' ', true)}] ` +
      `${Strings.pad(path.replace(new RegExp(`^${common}`), '@'), 60)} ` +
      `~${(end - start)} ms`
    );
  }
}

class Logger {
  log(event, ...args) {
    console.log((event instanceof BaseCoreEvent) ? `[INTENT/${event.type}]:` : event, ...args);
  }
  warn(event, ...args) {
    console.warn((event instanceof BaseCoreEvent) ? `[INTENT/WARN/${event.type}]:` : event, ...args);
  }
  error(event, ...args) {
    console.error((event instanceof BaseCoreEvent) ? `[INTENT/UNCAUGHT/${event.type}]:` : event, ...args);
  }
}
