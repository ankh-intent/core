
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { UpdateEvent } from '../events/UpdateEvent';
import { ReadyEvent } from '../events/ReadyEvent';
import { CoreEventBus } from '../CoreEventBus';
import { Watchdog } from '../../../intent-watchdog/core/Watchdog';
import { UnitInterface } from '../../../intent-watchdog/core/Unit';

export class WatchdogReadyConsumer extends AbstractConsumer<UpdateEvent, any>{
  private watchdog: Watchdog<UnitInterface>;

  public constructor(bus: CoreEventBus, watchdog: Watchdog<UnitInterface>) {
    super(bus);
    this.watchdog = watchdog;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ReadyEvent.type();
  }

  public process(event: CoreEvent<any>) {
    this.watchdog.start();
    this.stat(event, {
      type: 'log',
      message: {
        log: 'Watching for changes...',
      },
    });

    return event;
  }
}
