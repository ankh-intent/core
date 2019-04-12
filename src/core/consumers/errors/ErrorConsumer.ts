
import { Logger } from '../../utils/Logger';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { ErrorEvent } from '../../kernel/event/events/ErrorEvent';
import { SyntaxError } from '../../kernel/parser/SyntaxError';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { Strings } from '../../utils/Strings';
import { StatEvent } from '../../kernel/event/events/StatEvent';

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{
  private readonly logger: Logger;

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

    return new StatEvent({
      parent: event,
      stat: {
        type: 'error',
        error: this.describeError(event.data.error).join("\n"),
      },
    });
  }

  protected report(error) {
    this.logger.log(Logger.ERROR, ...this.describeError(error));
  }

  private describeError(error: Error) {
    if (error instanceof SyntaxError) {
      let stack;

      if (error.parent) {
        stack = this.fetchSyntaxStack(error);
      } else {
        stack = error.stack.split("\n");
      }

      let msg = stack.shift().toString();

      return [msg, "\n", stack.join("\n")];
    } else {
      return [error];
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
