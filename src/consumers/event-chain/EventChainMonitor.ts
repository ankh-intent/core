import { CoreEvent, StatEvent, AbstractConsumer } from '../../kernel';
import { EventChain } from './EventChain';

export class EventChainMonitor<E extends CoreEvent> extends AbstractConsumer<E, any>{
  private readonly chains: EventChain<E>[] = [];

  public supports(event: E): boolean {
    if (event.type === StatEvent.type()) {
      return false;
    }

    for (const chain of this.chains) {
      if (chain && chain.isRelated(event)) {
        return true;
      }
    }

    return false;
  }

  public monitor(events: E[]): EventChain<E> {
    const chain = new EventChain(events);
    chain.once(() => {
      const index = this.chains.indexOf(chain);

      if (index >= 0) {
        this.chains.splice(index, 1);
      }
    });

    this.chains.push(chain);

    return chain;
  }

  public process(event: E) {
    for (const chain of this.chains) {
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

