export class ConsumerStat {
  get type(): string {
    return (<typeof ConsumerStat>this.constructor).TYPE;
  }

  static get TYPE(): string {
    return this.name
      .replace(/Stat/, '')
      .toLowerCase();
  }
}
