
import { CoreEvent } from './CoreEvent';
import { AbstractConsumer } from './consumer/AbstractConsumer';

import { UpdateEvent } from '../../consumers/watching/UpdateEvent';
import { Emitter } from '../../../intent-utils/Emitter';
import { StatEvent } from './events/StatEvent';

export interface EventChainMonitoringData {
  start: Date;
  end: Date;
  original: UpdateEvent[];
  monitored: UpdateEvent[];
  accumulated: UpdateEvent[];
}

export type EventChainMonitoringConsumer = (data: EventChainMonitoringData) => any;

export class EventChainMonitor<E extends CoreEvent<any>> extends AbstractConsumer<E, any>{
  private readonly chains: EventChain<E>[] = [];

  public supports(event: E): boolean {
    if (event.type === StatEvent.type()) {
      return false;
    }

    for (let chain of this.chains) {
      if (chain && chain.isRelated(event)) {
        return true;
      }
    }

    return false;
  }

  public monitor(events: E[]): EventChain<E> {
    let chain = new EventChain(events);
    chain.once(() => {
      let index = this.chains.indexOf(chain);

      if (index >= 0) {
        this.chains.splice(index, 1);
      }
    });

    this.chains.push(chain);

    return chain;
  }

  public process(event: E) {
    for (let chain of this.chains) {
      if (chain) {
        if (chain.isOpened(event)) {
          chain.close(event);
        } else {
          chain.open(event);
        }
      }
    }

    return event;
  }
}

export class EventChain<E extends CoreEvent<any>> extends Emitter<EventChainMonitoringConsumer> {
  private readonly start: Date = new Date();
  private readonly accumulated: E[] = [];
  private readonly original: E[];
  private monitored: E[] = [];

  public constructor(original: E[]) {
    super();
    this.original = original;
  }

  public isRelated(event: E) {
    if (this.accumulated.indexOf(event) >= 0) {
      return true;
    }

    for (let original of this.original) {
      if (event.hasParent(original)) {
        return true;
      }
    }

    return false;
  }

  public isOpened(event: E) {
    return this.monitored.indexOf(event) >= 0;
  }

  public open(event: E) {
    if (this.accumulated.indexOf(event) >= 0) {
      return;
    }

    this.accumulated.push(event);
    this.monitored.push(event);

    for (let monitored of this.monitored) {
      if ((event !== monitored) && event.hasParent(monitored)) {
        if (this.close(monitored)) {
          break;
        }
      }
    }
  }

  public close(event: E): boolean {
    this.monitored = this.monitored.filter((e) => e !== event);
    let open = this.monitored.length;

    if (open) {
      return false;
    }

    setTimeout(() => {
      this.emit({
        original: this.original,
        accumulated: this.accumulated,
        start: this.start,
        end: new Date(),
      });
    }, 100);

    return true;
  }
}
