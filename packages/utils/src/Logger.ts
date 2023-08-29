import { yellow, blue } from 'colorette';

type LogMethod = 'silent' | 'log' | 'warn' | 'error';

export class Logger {
    static INFO = 1;
    static WARNING = 2;
    static ERROR = 3;
    static SILENT = 4;
    private static map: Record<number, LogMethod> = {
        [Logger.SILENT]: 'silent',
        [Logger.INFO]: 'log',
        [Logger.WARNING]: 'warn',
        [Logger.ERROR]: 'error',
    };
    private static methods: Record<number, (...args: any[]) => void> = {
        [Logger.SILENT]: () => {},
        [Logger.INFO]: console.log.bind(console),
        [Logger.WARNING]: console.warn.bind(console),
        [Logger.ERROR]: console.error.bind(console),
    };

    public level: number;

    public constructor(level: number = Logger.INFO) {
        this.level = level;
    }

    public classify(klass: string, args: any[]): [string, string, any[]] {
        return (
            (typeof args[0] === 'string')
                ? [klass, args[0], args.slice(1)]
                : [klass, '', args]
        );
    }

    public log(level: number, ...args: any[]) {
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

    static levelToStr(level: number): LogMethod {
        return this.map[level] || this.map[this.WARNING];
    }

    static strToLevel(str: string): number | void {
        for (const [level, method] of Object.entries(this.map)) {
            if (method === str) {
                return +level;
            }
        }
    }
}
