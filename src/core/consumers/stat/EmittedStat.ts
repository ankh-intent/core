
import { Strings } from '../../../intent-utils/Strings';
import { CoreEvent } from '../../kernel/CoreEvent';
import { StatEvent } from '../../kernel/events/StatEvent';
import { Source } from '../reading/source/Source';
import { BaseStat } from './BaseStat';
import { Logger } from '../../../intent-utils/Logger';
import { CoreOptions } from '../../../Core';

export class EmittedStat extends BaseStat {
  private logger: Logger;

  public constructor(options: CoreOptions, logger: Logger) {
    super(options);
    this.logger = logger;
  }

  public process(event: StatEvent, { chip, index, source, start, end }): StatEvent {
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
    let pathS  = Strings.shrink(path.replace(new RegExp(`^${Strings.escapeRegExp(common)}`), '@'), 60);
    let timeS  = Strings.shrink(`~${String(end - start)}`, 6, true);

    this.logger.log(Logger.INFO, `${indexS} [${causeS}] ${pathS} ${timeS} ms`);

    return event;
  }
}
