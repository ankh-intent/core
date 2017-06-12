
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { StatEvent } from '../events/StatEvent';

export class StatConsumer extends AbstractConsumer<StatEvent, any>{

  public supports(event: CoreEvent<any>): boolean {
    return event.type === StatEvent.type();
  }

  public process(event: StatEvent) {
    if (event.data.stat === 'ready') {
      return event;
    }
  }
}
