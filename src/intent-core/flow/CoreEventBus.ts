
import { CoreEvent, CoreEventConsumer } from './CoreEvent';
import { StatEvent } from './events/StatEvent';

export class CoreEventBus {
  private consumers: CoreEventConsumer<any, any>[] = [];

  public add(consumer: CoreEventConsumer<any, any>): this {
    return this.consumers.push(consumer), this;
  }

  public reset() {
    this.consumers = [];
  }

  public off(consumer: CoreEventConsumer<any, any>): number {
    let index, n = 0;

    while ((index = this.consumers.indexOf(consumer)) >= 0) {
      delete this.consumers[index];
      n++;
    }

    return n;
  }

  public emit(event: CoreEvent<any>): CoreEvent<any> {
    for (let consumer of this.consumers) {
      let processed = consumer.consume(event);

      if (event === processed) {
        if (!event.bubble) {
          break;
        }

        continue;
      }

      if (!processed) {
        break;
      }

      if (processed.bubble) {
        if (!processed.parent) {
          processed.parent = event;
        }

        event = this.emit(processed);
      }

      break;
    }

    return event;
  }

  public stat(data: any, parent?: CoreEvent<any>): CoreEvent<any> {
    return this.emit(new StatEvent({
      stat: data,
    }, parent));
  }
}
