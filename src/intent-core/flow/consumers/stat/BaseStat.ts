
import { CoreOptions } from '../../../../Core';
import { StatEvent } from '../../events/StatEvent';

export class BaseStat {
  protected options: CoreOptions;

  public constructor(options: CoreOptions) {
    this.options = options;
  }

  public process(event: StatEvent, data: any): StatEvent {
    return event;
  }
}
