
import { Strings, Logger } from '@intent/utils';

import { CoreConfig } from '../../CoreConfig';
import { CoreEvent, StatEvent } from '../../kernel/event';
import { Source } from '../../kernel/source';
import { BaseStat } from './BaseStat';

export class EmittedStat extends BaseStat {
  private readonly logger: Logger;

  public constructor(config: CoreConfig, logger: Logger) {
    super(config);
    this.logger = logger;
  }

  public process(event: StatEvent, { identifiable, index, source, start, end }): StatEvent {
    const path = (<Source>source).reference;
    const common = Strings.commonPath([
      path,
      this.config.paths.project,
      this.config.paths.internal,
    ]);
    let cause = '<root>';
    let parent: CoreEvent<any>|null = event;

    while (parent) {
      parent = parent.parent;

      if (parent) {
        const data: any = parent.data;

        if (data.identifiable && (data.identifiable !== identifiable)) {
          cause = data.identifiable.name;
          break;
        }
      }
    }

    const indexS = Strings.pad(String(index), 5, ' ', true);
    const causeS = Strings.shrink(cause, 10, true);
    const pathS  = Strings.shrink(Strings.stripLeft(path, `${common}/`), 60);
    const timeS  = Strings.shrink(`~${String(end - start)}`, 6, true);

    this.logger.log(Logger.INFO, `${indexS} [${causeS}] ${pathS} ${timeS} ms`);

    return event;
  }
}
