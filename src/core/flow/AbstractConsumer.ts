
import { CoreEvent, CoreEventConsumer } from './CoreEvent';
import { ErrorEvent } from './events/ErrorEvent';
import { CoreEventBus } from './CoreEventBus';

export abstract class AbstractConsumer<E extends CoreEvent<T>, T> implements CoreEventConsumer<T, E> {
  private bus: CoreEventBus;

  public abstract supports(event: CoreEvent<any>): boolean;
  public abstract process(event: E): CoreEvent<any>|void;

  public constructor(bus: CoreEventBus) {
    this.bus = bus;
  }

  public consume(event: E): CoreEvent<any>|void {
    if (!this.supports(event)) {
      return event;
    }

    try {
      return this.process(event);
    } catch (e) {
      return new ErrorEvent({
        error: e,
        parent: event,
      });
    }
  }

  public emit(event: CoreEvent<any>): CoreEvent<any> {
    return this.bus.emit(event);
  }

  public stat(parent: CoreEvent<any>, data: any): CoreEvent<any> {
    return this.bus.stat(data, parent);
  }
}
