
import { Strings } from '../../../intent-utils/Strings';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { StatEvent } from '../../kernel/event/events/StatEvent';
import { Source } from '../../kernel/source/Source';
import { BaseStat } from './BaseStat';
import { Logger } from '../../../intent-utils/Logger';
import { CoreConfig } from '../../../Core';

export class EmittedStat extends BaseStat {
  private readonly logger: Logger;

  public constructor(config: CoreConfig, logger: Logger) {
    super(config);
    this.logger = logger;
  }

  public process(event: StatEvent, { chip, index, source, start, end }): StatEvent {
    let path = (<Source>source).reference;
    let common = Strings.longestCommon([
      path,
      this.config.paths.project,
//      this.config.resolver.paths.intent // todo: fix library resolving
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
    let pathS  = Strings.shrink(path.replace(new RegExp(`^${Strings.escapeRegExp(common)}`), '@'), 60);
    let timeS  = Strings.shrink(`~${String(end - start)}`, 6, true);

    this.logger.log(Logger.INFO, `${indexS} [${causeS}] ${pathS} ${timeS} ms`);

    return event;
  }
}
