import { Logger, Strings } from '@intent/utils';
import { SyntaxError } from '@intent/parser';

import { CoreEvent, AbstractConsumer, ErrorEvent, CoreEventBus, StatEvent } from '../kernel/event';

const NATIVE_ERROR_LOC_MATCHER = /^(?:\s*at\s*)?(.*?)(?:\s*\(([^()]+)\))?$/;

enum RefType {
  NATIVE,
  AST,
}

interface ErrorRef {
  type: RefType;
  ref: string;
  source: string;
  combined: number;
}

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any>{
  private readonly logger: Logger;

  public constructor(bus: CoreEventBus, logger: Logger) {
    super(bus);
    this.logger = logger;
  }

  public supports(event: CoreEvent): boolean {
    return event.type === ErrorEvent.type();
  }

  public process(event: ErrorEvent) {
    let parent: CoreEvent|null = event;
    const causes: CoreEvent[] = [];

    while (parent) {
      const { type, data } = parent;

      if (type === ErrorEvent.type()) {
        if (causes.length) {
          this.flushCauses(causes);
        }

        this.report(data.error);
      } else {
        causes.push(parent);
      }

      parent = parent.parent;
    }

    if (causes.length) {
      this.flushCauses(causes);
    }

    return new StatEvent({
      parent: event,
      stat: {
        type: 'error',
        error: this.describeError(event.data.error).join("\n"),
      },
    });
  }

  protected flushCauses(causes: CoreEvent[]) {
    this.logger.log(Logger.ERROR, ' caused by:', causes.reduce(
      ((str, { type, data }) => ((type + ((<any>data).identifier ? `(${(<any>data).identifier})` : '')) + '->' + str)),
      ''
    ));

    causes.splice(0, causes.length);
  }

  protected report(error) {
    this.logger.log(Logger.ERROR, ...this.describeError(error));
  }

  private describeError(error: Error) {
    if (error instanceof SyntaxError) {
      const stack = this.fetchSyntaxStack(error);
      const msg = stack.shift().toString();

      return [msg, "\n", stack.join("\n")];
    } else {
      return [error];
    }
  }

  private fetchSyntaxStack(error: SyntaxError) {
    const hops: ErrorRef[] = [];
    let e: any = error;

    const consumeErrorDescription = (stack: ErrorRef[]|undefined) => {
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

    return [{
      type: RefType.AST,
      ref: error.expectation,
      combined: 1,
      source,
    }];
  }

  private describeNativeError(error: Error): ErrorRef[] {
    return (error.stack || '')
      .split("\n")
      .slice(1)
      .map(line => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [, ref = '', source = ''] = line.match(NATIVE_ERROR_LOC_MATCHER) || [,,,];

        return {
          type: RefType.NATIVE,
          ref,
          source,
          combined: 1,
        };
      })
    ;
  }

  private squashErrors(descriptors: ErrorRef[]): ErrorRef[] {
    return descriptors
      .reduce((acc: ErrorRef[], current: ErrorRef) => {
        if (current.type === RefType.AST) {
          const prev = acc[acc.length - 1];

          if (prev && (prev.type === RefType.AST) && (prev.source === current.source) && prev.combined < 2) {
            prev.ref = `${current.ref}->${prev.ref}`;
            prev.combined += current.combined;
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
