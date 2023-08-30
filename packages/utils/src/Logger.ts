import { yellow, blue } from 'colorette';

export type LogMethodName = 'info' | 'log' | 'warn' | 'error';
type LogLevelName = 'silent' | LogMethodName;

export enum LogLevel {
    INFO = 1,
    LOG = 2,
    WARNING = 3,
    ERROR = 4,
    SILENT = 5,
}

export class Logger {
    static SILENT = LogLevel.SILENT;
    static INFO = LogLevel.INFO;
    static LOG = LogLevel.LOG;
    static WARNING = LogLevel.WARNING;
    static ERROR = LogLevel.ERROR;

    private static map: Record<number, LogLevelName> = {
        [Logger.INFO]: 'info',
        [Logger.LOG]: 'log',
        [Logger.WARNING]: 'warn',
        [Logger.ERROR]: 'error',
        [Logger.SILENT]: 'silent',
    };

    private static methods: Record<number, (...args: any[]) => void> = {
        [Logger.SILENT]: () => {},
        [Logger.INFO]: console.info.bind(console),
        [Logger.LOG]: console.log.bind(console),
        [Logger.WARNING]: console.warn.bind(console),
        [Logger.ERROR]: console.error.bind(console),
    };

    public level: LogLevel = LogLevel.INFO;

    public constructor(level: LogLevel) {
        this.level = level;
    }

    public classify(klass: string, args: any[]): [string, string, any[]] {
        return (
            (typeof args[0] === 'string')
                ? [klass, args[0], args.slice(1)]
                : [klass, '', args]
        );
    }

    public log(level: LogLevel, ...args: any[]) {
        console.log({ level, this: this.level, skip: level < this.level });
        if (level < this.level) {
            return;
        }

        const [classifier, message, out] = this.classify('', args);

        Logger.methods[level](
            `[${yellow(this.timestamp())}] ${blue(this.name)}${classifier ? `/${blue(classifier)}` : ''}:${message ? ' ' + message : ''}`,
            ...out,
        );
    }

    protected timestamp(): string {
        return (new Date()).toTimeString().split(' ', 2)[0];
    }

    protected get name() {
        return this.constructor.name.replace(/Logger$/, '').toUpperCase();
    }

    static levelToStr(level: LogLevel): LogLevelName {
        return this.map[level] || this.map[this.WARNING];
    }

    static strToLevel(str: string): LogLevel | void {
        for (const [level, method] of Object.entries(this.map)) {
            if (method === str) {
                return +level;
            }
        }
    }
}
