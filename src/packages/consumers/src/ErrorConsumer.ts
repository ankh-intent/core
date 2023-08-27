import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
    Logger,
    Strings,
    SyntaxError,
    CoreEvent,
    AbstractConsumer,
    ErrorEvent,
    CoreEventBus,
    StatEvent,
} from '@intent/kernel';

const internal = __dirname.replace(/[\\\/]packages[\\\/][^\\/]+[\\\/]src[\\\/]?.*?$/, sep + 'packages');

enum RefType {
    NATIVE,
    AST,
}

interface ErrorRef {
    type: RefType;
    ref: string;
    source: string;
    combined: number;
    fileName?: string;
}

export class ErrorConsumer extends AbstractConsumer<ErrorEvent, any> {
    private readonly logger: Logger;
    private readonly verbose: boolean;

    public constructor(bus: CoreEventBus, logger: Logger, verbose: boolean) {
        super(bus);
        this.logger = logger;
        this.verbose = verbose;
    }

    public supports(event: CoreEvent): boolean {
        return event.type === ErrorEvent.type();
    }

    public process(event: ErrorEvent) {
        let parent: CoreEvent | null = event;
        const causes: CoreEvent[] = [];

        while (parent) {
            if (parent.is(ErrorEvent)) {
                if (causes.length) {
                    this.flushCauses(causes);
                }

                this.report(parent.data.error);
            } else {
                causes.push(parent);
            }

            parent = parent.parent;
        }

        if (causes.length) {
            this.flushCauses(causes);
        }

        return new StatEvent(event, {
            type: 'error',
            error: this.describeError(event.data.error).join('\n'),
        });
    }

    protected flushCauses(causes: CoreEvent<any>[]) {
        const cause = causes.reduce(
            ((str, { type, data: { identifier } }) => ((type + (identifier ? `(${identifier})` : '')) + '->' + str)),
            '',
        );
        causes.splice(0, causes.length);

        this.logger.log(Logger.ERROR, ' caused by:', cause);
    }

    protected report(error: Error) {
        this.logger.log(Logger.ERROR, ...this.describeError(error));
    }

    private describeError(error: Error) {
        if (error instanceof SyntaxError) {
            const stack = this.fetchSyntaxStack(error);
            const msg = stack.shift().toString();

            return [msg, '\n', stack.join('\n')];
        } else {
            return [error];
        }
    }

    private fetchSyntaxStack(error: SyntaxError) {
        const hops: ErrorRef[] = [];
        let e: any = error;

        const consumeErrorDescription = (stack: ErrorRef[] | undefined) => {
            if (stack && stack.length) {
                hops.unshift(...stack);
            }
        };

        while (true) {
            const isSyntaxError = e instanceof SyntaxError;

            consumeErrorDescription(
                isSyntaxError
                    ? this.describeSyntaxError(e)
                    : this.describeNativeError(e),
            );


            if (!e.parent) {
                if (isSyntaxError) {
                    consumeErrorDescription(this.describeNativeError(e));
                }

                break;
            }

            e = e.parent;
        }

        const stack = this.squashErrors(
            hops
                .filter(Boolean)
                .filter((def) => !def.source?.startsWith(internal)),
        );
        const max = Strings.max(stack.map((def) => def.ref));

        const lines = stack
            .map((def) => (
                `\tat ${Strings.pad(def.ref, max, ' ')} (${def.source})${def.fileName ? ` (${def.fileName})` : ''}`
            ))
            .filter(Boolean)
        ;

        return [e.message].concat(lines);
    }

    private describeSyntaxError(error: SyntaxError): ErrorRef[] | undefined {
        const source = error.source?.location(error.pos).toString();
        const fileName = source && pathToFileURL(resolve(process.cwd(), source)).toString() || '';

        return [{
            type: RefType.AST,
            ref: error.expectation,
            combined: 1,
            source,
            fileName,
        }];
    }

    private describeNativeError(error: Error): ErrorRef[] | undefined {
        if (!this.verbose) {
            return;
        }

        return (error.stack || '')
            .split('\n')
            .filter((line) => !!line.match(/^\s+at /i))
            .map(line => line.trim())
            .filter(Boolean)
            .map((line) => {
                return {
                    type: RefType.NATIVE,
                    combined: 1,
                    ...this.parseFrame(line),
                };
            });
    }

    /** @copyright https://github.com/stacktracejs/error-stack-parser */
    private parseFrame(line: string) {
        if (line.indexOf('(eval ') > -1) {
            line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
        }

        let sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');
        const [rawLocation, rawSource] = sanitizedLine.match(/ (\(.+:\d+:\d+\)$)/) || [];

        sanitizedLine = rawLocation ? sanitizedLine.replace(rawLocation, '') : sanitizedLine;

        const tokens = sanitizedLine.split(/\s+/).slice(1);
        const [source, fileName] = this.extractLocation(rawSource ? rawSource : tokens.pop()!) || [];
        const ref = tokens.join(' ') || '';

        return {
            ref,
            source,
            fileName: (['eval', '<anonymous>'].indexOf(fileName) > -1) ? undefined : fileName,
        };
    }

    private extractLocation(urlLike: string) {
        const normalized = urlLike.replace(/[()]/g, '');

        if (normalized.indexOf(':', 2) === -1) {
            return [normalized, normalized];
        }

        const match = normalized.match(/(.+?)(?::(\d+))?(?::(\d+))?$/);

        return match && [match[1], pathToFileURL(match[0]).toString()];
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
            }, [] as ErrorRef[])
            .map((def) => (
                (def.type === RefType.AST)
                    ? { ...def, ref: `AST::${def.ref}` }
                    : def
            ));
    }
}
