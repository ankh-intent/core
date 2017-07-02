
import { Logger } from '../../../intent-utils/Logger';
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { ErrorEvent } from '../events/ErrorEvent';
import { SyntaxError } from '../../parser/SyntaxError';
import { CoreEventBus } from '../CoreEventBus';
import { Strings } from '../../../intent-utils/Strings';

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
        this.logger.log(Logger.ERROR, ' caused by:', type, (<any>data).path ? `(${(<any>data).path})` : '');
      }
    }
  }

  protected report(error) {
    if (error instanceof SyntaxError) {
      let stack;

      if (error.parent) {
        stack = this.fetchSyntaxStack(error);
      } else {
        stack = error.stack.split("\n");
      }

      let msg = stack.shift().toString();

      this.logger.log(Logger.ERROR, msg, "\n", stack.join("\n"));
    } else {
      this.logger.log(Logger.ERROR, error);
    }
  }

  private fetchSyntaxStack(error: SyntaxError) {
    let hops = [];
    let e: any = error;
    let last: Error;

    while (e) {
      if (e instanceof SyntaxError) {
        hops.unshift(this.describeSyntaxError(e));
      } else {
        hops.unshift(e.toString());
      }

      last = e;
      e = e.parent;
    }

    let stack = last.stack.split("\n").concat(hops).map((line) => line.trim());
    let max = Strings.max(stack.map((line) => line.replace(/(.*?)\s*\(.*/, '$1')));
    let lines = stack.map((line) => {
      return line
        .replace(/(.*?)\s*\(([^)]+)\)/, (m, ref, loc) => {
          return `\t${Strings.pad(ref, max, ' ')} (${loc})`;
        })
      ;
    });

    return [last.message].concat(lines);
  }

  private describeSyntaxError(error: SyntaxError) {
    let source;

    if (error.source) {
      let loc = error.source.location(error.pos);
      source = ` (${error.source.reference}:${loc.line}:${loc.column})`;
    } else {
      source = '';
    }

    let match = error.message.match(/Failed @(.+)$/);
    let method = match ? match[1] : 'unknown';

    return `at AST::${method}${source}`;
  }
}
