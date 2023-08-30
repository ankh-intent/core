import { yellow, blue } from 'colorette';

export type LogTypeName = 'trace' | 'debug' | 'log' | 'warning' | 'error';
type LogLevelName = 'silent' | LogTypeName;

export enum LogLevel {
    ANNOYING = 1,
    VERBOSE = 2,
    NORMAL = 3,
    SPARSE = 4,
    CRITICAL = 5,
    SILENT = 6,

    MAX = SILENT,
}

export enum LogType {
    TRACE = LogLevel.ANNOYING,
    DEBUG = LogLevel.VERBOSE,
    LOG = LogLevel.NORMAL,
    WARNING = LogLevel.SPARSE,
    ERROR = LogLevel.CRITICAL,
}

export class Logger {
    static ANNOYING = LogLevel.ANNOYING;
    static VERBOSE = LogLevel.VERBOSE;
    static NORMAL = LogLevel.NORMAL;
    static SPARSE = LogLevel.SPARSE;
    static CRITICAL = LogLevel.CRITICAL;
    static SILENT = LogLevel.SILENT;

    private static map: Record<LogType, LogTypeName> = {
        [LogType.TRACE]: 'trace',
        [LogType.DEBUG]: 'debug',
        [LogType.LOG]: 'log',
        [LogType.WARNING]: 'warning',
        [LogType.ERROR]: 'error',
    };

    private static methods: Record<LogType, (...args: any[]) => void> = {
        [LogType.TRACE]: console.trace.bind(console),
        [LogType.DEBUG]: console.info.bind(console),
        [LogType.LOG]: console.log.bind(console),
        [LogType.WARNING]: console.warn.bind(console),
        [LogType.ERROR]: console.error.bind(console),
    };

    static TRACE = this.map[LogType.TRACE];
    static DEBUG = this.map[LogType.DEBUG];
    static LOG = this.map[LogType.LOG];
    static WARNING = this.map[LogType.WARNING];
    static ERROR = this.map[LogType.ERROR];

    public level: LogLevel;

    public constructor(level: LogLevel) {
        this.level = level;
    }

    public is(level?: LogType): level is LogType {
        return !!level && (this.level <= level);
    }

    public classify(klass: string, args: any[]): [string, string, any[]] {
        return (
            (typeof args[0] === 'string')
                ? [klass, args[0], args.slice(1)]
                : [klass, '', args]
        );
    }

    public log(type: LogTypeName, ...args: any[]) {
        const level = Logger.strToLevel(type);

        if (!this.is(level)) {
            return;
        }

        const method = Logger.methods[level];
        const [classifier, message, out] = this.classify('', args);

        method(
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

    static inverse(level: LogLevel): LogLevel {
        return (LogLevel.MAX - level) % LogLevel.MAX + 1;
    }

    static levelToStr(level: LogType): LogLevelName | undefined {
        return this.map[level];
    }

    static strToLevel(str: LogLevelName): LogType | undefined {
        for (const [level, method] of Object.entries(this.map)) {
            if (method === str) {
                return +level;
            }
        }
    }
}
