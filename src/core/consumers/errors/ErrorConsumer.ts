
import { Logger } from '../../utils/Logger';
import { Strings } from '../../utils/Strings';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { ErrorEvent } from '../../kernel/event/events/ErrorEvent';
import { SyntaxError } from '../../kernel/parser/SyntaxError';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { StatEvent } from '../../kernel/event/events/StatEvent';

const NATIVE_ERROR_LOC_MATCHER = /^(?:\s*at\s*)?(.*?)(?:\s*\(([^()]+)\))?$/;

enum RefType {
  NATIVE,
  AST,
}

interface ErrorRef {
  type: RefType;
  ref: string;
  source: string;
}

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
      const { type, data } = parent;
      parent = parent.parent;

      if (type === ErrorEvent.type()) {
        this.report(data.error);
      } else {
        this.logger.log(Logger.ERROR, ' caused by:', type, (<any>data).identifier ? `(${(<any>data).identifier})` : '');
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

      const msg = stack.shift().toString();

      return [msg, "\n", stack.join("\n")];
    } else {
      return [error];
    }
  }

  private fetchSyntaxStack(error: SyntaxError) {
    const hops = [];
    let e: any = error;

    const consumeErrorDescription = (stack) => {
      if (stack && stack.length) {
        hops.unshift(...stack);
      }
    };

    while (true) {
      const isSyntaxError = e instanceof SyntaxError;

      consumeErrorDescription(
        isSyntaxError
          ? this.describeSyntaxError(e)
          : this.describeNativeError(e)
      );


      if (!e.parent) {
        if (isSyntaxError) {
          consumeErrorDescription(this.describeNativeError(e));
        }

        break;
      }

      e = e.parent;
    }

    const internal = Strings.getRootSrcPath();
    const stack = this.squashErrors(
      hops
        .filter(Boolean)
        .filter(def => !(def.source && def.source.startsWith(internal)))
    );
    const max = Strings.max(stack.map(def => def.ref));

    const lines = stack
      .map((def) => {
        return `\tat ${Strings.pad(def.ref, max, ' ')} (${def.source})`;
      })
      .filter(Boolean)
    ;

    return [e.message].concat(lines);
  }

  private describeSyntaxError(error: SyntaxError): ErrorRef[]|undefined {
    let source;

    if (error.source) {
      const loc = error.source.location(error.pos);
      source = `${error.source.reference}:${loc.line}:${loc.column}`;
    } else {
      source = '';
    }

    const match = error.message.match(/Failed @(.+)$/);

    if (match) {
      return [{
        type: RefType.AST,
        ref: match[1],
        source,
      }];
    }
  }

  private describeNativeError(error: Error): ErrorRef[] {
    return error.stack
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [, ref, source] = line.match(NATIVE_ERROR_LOC_MATCHER) || [,,,];

        return {
          type: RefType.NATIVE,
          ref,
          source,
        };
      })
    ;
  }

  private squashErrors(descriptors: ErrorRef[]): ErrorRef[] {
    return descriptors
      .reduce((acc: ErrorRef[], current: ErrorRef) => {
        if (current.type === RefType.AST) {
          const prev = acc[acc.length - 1];

          if (prev && (prev.type === RefType.AST) && (prev.source === current.source)) {
            prev.ref = `${current.ref}->${prev.ref}`;
          } else {
            acc.push(current);
          }
        } else {
          acc.push(current);
        }

        return acc;
      }, [] as any)
      .map(def => (
        (def.type === RefType.AST)
          ? { ...def, ref: `AST::${def.ref}` }
          : def
      ))
    ;
  }
}
