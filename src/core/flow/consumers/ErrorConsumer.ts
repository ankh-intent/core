
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { ErrorEvent } from '../events/ErrorEvent';
import { SyntaxError } from '../../parser/SyntaxError';
import { CoreEventBus } from '../CoreEventBus';

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{
  private logger: Logger;

  public constructor(bus: CoreEventBus, logger: Logger) {
    super(bus);
    this.logger = logger;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ErrorEvent.type();
  }

  public process(event: ErrorEvent) {
    let parent: CoreEvent<any> = event;

    while (parent) {
      let { type, data } = parent;
      parent = parent.parent;

      if (type === ErrorEvent.type()) {
        this.report(data.error);
      } else {
        this.logger.log(Logger.ERROR, ' caused by:', type, (<any>data).path ? ' ' + (<any>data).path : '');
      }
    }
  }

  protected report(error) {
    if (error instanceof SyntaxError) {
      let msg = error.toString();

      if (error.source) {
        let loc = error.source.location(error.pos);
        msg = `${error.source.reference}:${loc.line}:${loc.column}: ${msg}`;
      }

      this.logger.log(Logger.ERROR, msg);

      if (error.parent) {
        this.logger.log(Logger.ERROR, ' caused by:');
        this.report(error.parent);
      } else {
        this.logger.log(Logger.ERROR, error.stack);
      }
    } else {
      this.logger.log(Logger.ERROR, error);
    }
  }
}
