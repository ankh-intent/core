
export class Logger {
  static INFO = 0;
  static WARNING = 1;
  static ERROR = 2;
  private static map = {
    [Logger.INFO]: 'log',
    [Logger.WARNING]: 'warn',
    [Logger.ERROR]: 'error',
  };

  public classify(args: any[]): [string, any[]] {
    return ['', args];
  }

  public log(level: number, ...args: any[]) {
    const [classifier, out] = this.classify(args);

    console[Logger.levelToStr(level)].call(
      console,
      `[${this.timestamp()}] ${this.name}${classifier ? `/${classifier}` : ''}:`,
      ...out
    );
  }

  protected timestamp(): string {
    return (new Date()).toTimeString().split(' ', 2)[0];
  }

  protected get name() {
    return this.constructor.name.replace(/Logger$/, '').toUpperCase();
  }

  static levelToStr(level: number): string {
    return this.map[level] || this.map[this.WARNING];
  }

  static strToLevel(str: string): number {
    for (const level in this.map) {
      if (this.map[level] === str) {
        return +level;
      }
    }

    return this.WARNING;
  }
}
