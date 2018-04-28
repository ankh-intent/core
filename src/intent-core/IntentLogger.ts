
import { Logger } from '../intent-utils/Logger';
import { BaseCoreEvent } from '../core/kernel/CoreEvent';

export class IntentLogger extends Logger {
  public classify(args: any[]): [string, any[]] {
    let event = args[0];

    if (event instanceof BaseCoreEvent) {
      return [event.type, args.slice(1)];
    } else {
      return super.classify(args);
    }
  }
}
