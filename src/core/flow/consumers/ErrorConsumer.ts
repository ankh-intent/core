
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { ErrorEvent } from '../events/ErrorEvent';
import { SyntaxError } from '../../parser/SyntaxError';

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{

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
        console.log(' caused by:', type, (<any>data).path ? ' ' + (<any>data).path : '');
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

      console.error(`[INTENT/SYNTAX]: ${msg}`);

      if (!error.parent) {
        console.error(error.stack);
      } else {
        this.report(error.parent);
      }
    } else {
      console.error(`[INTENT/ERROR]:`, error);
    }
  }
}
