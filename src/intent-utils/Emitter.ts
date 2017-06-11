

import { Eventable } from './Eventable';

export class Emitter<F extends Function> {
  private static EMIT = 'emit';

  private eventable = new Eventable();

  public emit(...args): number {
    return this.eventable.emit(Emitter.EMIT, ...args);
  }

  public and(handler: F): number {
    return this.eventable.on(Emitter.EMIT, (...args) => {
      args.pop(); // remove event from top

      return handler(...args);
    });
  }

  public once(handler: F): number {
    return this.eventable.once(Emitter.EMIT, (...args) => {
      args.pop();

      return handler(...args);
    });
  }

  public off(uid?: number): void {
    return this.eventable.off(Emitter.EMIT, uid);
  }
}

