
import { Strings } from '../../utils/Strings';
import { Logger } from '../../utils/Logger';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { StatEvent } from '../../kernel/event/events/StatEvent';
import { Source } from '../../kernel/source/Source';
import { BaseStat } from './BaseStat';
import { CoreConfig } from '../../Core';

export class EmittedStat extends BaseStat {
  private readonly logger: Logger;

  public constructor(config: CoreConfig, logger: Logger) {
    super(config);
    this.logger = logger;
  }

  public process(event: StatEvent, { identifiable, index, source, start, end }): StatEvent {
    const path = (<Source>source).reference;
    const common = Strings.longestCommon([
      path,
      this.config.paths.project,
      this.config.paths.internal,
    ]).pop();
    let cause = '<root>';
    let parent: CoreEvent<any> = event;

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
    const pathS  = Strings.shrink(path.replace(new RegExp(`^${Strings.escapeRegExp(common)}/`), ''), 60);
    const timeS  = Strings.shrink(`~${String(end - start)}`, 6, true);

    this.logger.log(Logger.INFO, `${indexS} [${causeS}] ${pathS} ${timeS} ms`);

    return event;
  }
}
