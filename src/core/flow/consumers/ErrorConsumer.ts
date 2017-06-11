
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { ErrorEvent } from '../events/ErrorEvent';
import { SyntaxError } from '../../parser/SyntaxError';

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ErrorEvent.type();
  }

  public process(event: ErrorEvent) {
    while (event) {
      if (event.type === ErrorEvent.type()) {
        this.report(event.data.error);
        event = event.data.parent;
      } else {
        break;
      }
    }
  }

  protected report(error) {
    if (error instanceof SyntaxError) {
      let loc = error.source.location(error.pos);
      console.error(`[INTENT/ERROR]: ${error.source.reference}:${loc.line}:${loc.column}: ${error.toString()}`);
      console.error(error.stack);
    } else {
      console.error(`[INTENT/ERROR]:`, error);
    }
  }

}
