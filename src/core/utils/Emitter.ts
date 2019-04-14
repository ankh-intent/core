import { Eventable } from './Eventable';

export class Emitter<F extends Function> {
  private static EMIT = 'emit';

  private eventable = new Eventable();

  public emit(...args): number {
    return this.eventable.emit(Emitter.EMIT, ...args);
  }

  public and(handler: F, once = false): number {
    const shifter = (...args) => {
      args.pop(); // remove event from top

      return handler(...args);
    };

    return (
      once
        ? this.eventable.once(Emitter.EMIT, shifter)
        : this.eventable.on(Emitter.EMIT, shifter)
    );
  }

  public once(handler: F): number {
    return this.and(handler, true);
  }

  public off(uid?: number): void {
    return this.eventable.off(Emitter.EMIT, uid);
  }
}

