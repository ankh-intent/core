
import { Logger } from '../../utils/Logger';
import { BaseCoreEvent } from '../event/CoreEvent';

export class CoreLogger extends Logger {
  public classify(args: any[]): [string, any[]] {
    const event = args[0];

    if (event instanceof BaseCoreEvent) {
      return [event.type, args.slice(1)];
    } else {
      return super.classify(args);
    }
  }
}
